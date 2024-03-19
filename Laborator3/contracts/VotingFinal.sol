// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Voting{

    modifier votingActive(){
        require(block.timestamp <= endVoting, "Voting has ended!");
        _;
    }

    modifier votingEnded(){
        require(block.timestamp > endVoting, "Voting in progress!");
        _;
    }

    modifier onlyChairPerson(){
        require(msg.sender == chairperson, "Unauthorized!");
        _;
    }

    error InvalidVote();

    function sort(uint[] memory v) public pure returns (uint[] memory) {
        uint len = v.length;
        for (uint i = 0; i < len - 1; i++) {
                for (uint j = 0; j < len - i - 1; j++) {
                    if (v[j] > v[j + 1]) {
                        (v[j], v[j + 1]) = (v[j + 1], v[j]);
                }
            }
        }
        return v;
    }

    modifier validVote(uint[] memory votes, uint len){
        votes  = sort(votes);
        if (votes.length != len)
            revert InvalidVote();
  
        for (uint i = 0; i < votes.length; i++) 
            if (proposals[votes[i]].state != State.Active)  
                revert InvalidVote();

        for (uint i = 0; i < votes.length - 1; i++) 
            if (votes[i] == votes[i+1])  
                revert InvalidVote();
        _;

    }

    event UpdateProposalState(bytes32 indexed projectName, string indexed teamName, State state);
    event NewVote(address indexed voter, bytes32 indexed token);

    enum State { Active, Inactive, Locked } 

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

    address public chairperson;

    uint endRegister;
    uint endVoting;

    mapping(address => Voter) public voters;
    mapping(bytes32 => address) voteTokens;
    mapping(string => bytes32) projects;

    Proposal[] public proposals;

    uint nrReqVotes;

    constructor(uint argNrReqVotes) {
        chairperson = msg.sender;
        endRegister = block.timestamp + 10 days;
        endVoting = block.timestamp + 20 days;
        nrReqVotes = argNrReqVotes;
    }

    function registerProposal(bytes32 projectName, string memory teamName) onlyChairPerson external {
        require(block.timestamp <= endRegister, "Registration has ended");
        require(projects[teamName] == 0, "Team has already register a project");
        proposals.push(Proposal({
            projectName: projectName,
            teamName: teamName,
            voteCount: 0,
            state: State.Inactive
        }));
        projects[teamName] = projectName;
    }

    function setProposalState(uint idx, State state) onlyChairPerson external{
        require (proposals[idx].state != state && !(proposals[idx].state == State.Active && state == State.Inactive), "Invalid state");
        proposals[idx].state = state;
        emit UpdateProposalState(proposals[idx].projectName, proposals[idx].teamName, state);
    }

    function registerVoter(bytes32 givenToken)  votingActive  external returns (bytes32 generatedToken){
        generatedToken =  keccak256(abi.encodePacked(givenToken, msg.sender));
        require (voteTokens[generatedToken] == address(0), "Token has been already used!" );
        voters[msg.sender].token = generatedToken;
        voters[msg.sender].voted = false;
        voteTokens[generatedToken] = msg.sender;

    }

    function vote(uint[] memory votes, bytes32 token) votingActive  validVote(votes, nrReqVotes)  external{
        require (voteTokens[token] == msg.sender, "Invalid token"); 
        require (voters[msg.sender].voted == false, "Voter has already voted!");
        for(uint i = 0; i < votes.length; i++){
            proposals[votes[i]].voteCount += 1;
            voters[msg.sender].votes.push(votes[i]);
        }

        voters[msg.sender].voted = true; 
        emit NewVote(msg.sender, token); 
    }

    function winningProposal() votingEnded onlyChairPerson public view returns (uint winningProposalId) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposalId = p;
            }
        }
    }      
}