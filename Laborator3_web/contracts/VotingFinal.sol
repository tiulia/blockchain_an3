// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Voting{

    enum State { Active, Inactive, Locked } 

    modifier votingActive (bool active){
        require (( endRegister < block.timestamp && endVoting >= block.timestamp) == active, active?"voting is over!":"voting still active");
        _;
    } 

    modifier registrationActive () {
        require (endRegister >= block.timestamp, "Registration is closed!");
        _;
    }  

    modifier onlyOwner() {
        require (msg.sender == chairperson, "Only admin!" );
        _;
    }  

    event ProposalStateChanged(uint indexed proposalIndex, State oldState, State newState);

    event VoteCast(address indexed voter, uint[] proposalIndices);

    event ProposalAdded(address indexed proposer, string indexed participant1, string indexed participant2, string teamName, uint proposalIdx );

    struct Voter{
        bool voted;
        bytes32 token;
        uint[] votes;
    }

    struct Proposal{
        bytes32 projectName;
        string teamName;
        uint voteCount;
        State state;
    }

    address chairperson;

    uint endRegister;
    uint endVoting;

    uint nonce;

    mapping(address => Voter) voters;
    mapping(address => bool)  teamMember;

    Proposal[] public proposals;

    constructor(uint regdays, uint votedays) {
        chairperson = msg.sender;
        endRegister = block.timestamp + (regdays * 24 * 60 * 60);
        endVoting   = block.timestamp + ((votedays + regdays) * 24 * 60 * 60);
    }


    function registerProposal(bytes32 projectName, string memory teamName, string memory participant1, string memory participant2) public registrationActive{
        require (teamMember[msg.sender] == false, "You already registerd a project!");
        
        proposals.push(Proposal({
            projectName: projectName,
            teamName: teamName,
            voteCount: 0,
            state: State.Inactive
        }));

        teamMember[msg.sender] = true;
        emit ProposalAdded(msg.sender, participant1, participant2, teamName, proposals.length - 1);
    }

    function getNumberOfProposals() external view returns (uint) {
        return proposals.length;
    }

    function getProposal(uint idx) external view returns (bytes32 projectName, string memory teamName, uint voteCount, State state) {
        require(idx < proposals.length, "Index out of bounds");
        Proposal memory proposal = proposals[idx];
        return (proposal.projectName, proposal.teamName, proposal.voteCount, proposal.state);
    }


    function setProposalState(uint idx, State newState) public registrationActive onlyOwner{
        require(idx < proposals.length, "Index out of bounds");
        State oldState = proposals[idx].state;
        proposals[idx].state = newState;
        emit ProposalStateChanged(idx, oldState, newState);
    }

    function extendRegisterDates(uint ndays) public onlyOwner registrationActive{
        endRegister += (ndays * 24 * 60 * 60);
        endVoting   += (ndays * 24 * 60 * 60);
        assert ( endVoting > endRegister);
    }

    function extendVotingDates(uint ndays) public onlyOwner votingActive (true){
        endVoting += (ndays * 24 * 60 * 60);
        assert ( endVoting > endRegister);
    }

    function registerVoter(bytes32 registerToken) public returns (bytes32 votingToken){
        bytes32 randToken =  keccak256(abi.encodePacked(nonce, registerToken, block.timestamp));  
        voters[msg.sender].token = randToken;
        voters[msg.sender].voted = false;
        votingToken = keccak256(abi.encodePacked(randToken, msg.sender));
        nonce += 1;
    }

    function vote(uint[] memory votes, bytes memory signedToken) public votingActive(true) {
        require (votes.length <= 3, "Vote only 3 proposals!");

        bytes32 randToken =  voters[msg.sender].token;
        bytes32 votingToken = keccak256(abi.encodePacked(randToken, msg.sender));

        bool validSig = checkSignature(signedToken, votingToken, msg.sender);
        
        
        require (validSig, "invliad signature!");


        for(uint i = 0; i < votes.length; i++){
            require(proposals[votes[i]].state == State.Active, "Invalid proposal state!");

            proposals[votes[i]].voteCount += 1;
            voters[msg.sender].votes.push(votes[i]);
        }

        voters[msg.sender].voted = true; 

        emit VoteCast(msg.sender, votes);

    }


    function winningProposal() external view votingActive(false) returns (uint winningProposalId) {        
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposalId = p;
            }
        }

    }


    function sigRSV(bytes memory sig) public pure returns (bytes32 r,bytes32 s,uint8 v) {
        require(sig.length == 65, "invalid signature");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }         

    function checkSignature(bytes memory sig, bytes32 text, address sender) public pure returns (bool rez) {
        (bytes32 r, bytes32 s, uint8 v) = sigRSV(sig);
        bytes32 hashMsg = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", text));
        rez = (ecrecover(hashMsg, v, r, s) == sender);
    }
}


