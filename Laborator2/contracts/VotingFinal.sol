// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Voting{

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

    uint nonce;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    constructor() {
        chairperson = msg.sender;
        endRegister = block.timestamp + 30 days;
        endVoting = block.timestamp + 40 days;
    }


    function registerProposal(bytes32 projectName, string memory teamName) external {
        proposals.push(Proposal({
            projectName: projectName,
            teamName: teamName,
            voteCount: 0,
            state: State.Inactive
        }));
    }

    function setProposalState(uint idx, State state) external{
        proposals[idx].state = state;
    }

    function registerVoter(bytes32 registerToken) external returns (bytes memory votingToken){
        bytes32 randToken =  keccak256(abi.encodePacked(nonce, registerToken, block.timestamp));  
        voters[msg.sender].token = randToken;
        voters[msg.sender].voted = false;
        votingToken = abi.encodePacked(randToken, msg.sender);
        nonce += 1;
    }

    function vote(uint[] memory votes, bytes memory signedToken) external{
        require (endVoting >= block.timestamp, "voting is over!");
        bytes32 randToken =  voters[msg.sender].token;
        bytes memory votingToken = abi.encodePacked(randToken, msg.sender);

        bool validSig = checkSignature(signedToken, votingToken, msg.sender);
        
        require (validSig, "invliad signature!");


        for(uint i = 0; i < votes.length; i++){
            proposals[votes[i]].voteCount += 1;
            voters[msg.sender].votes.push(votes[i]);
        }

        voters[msg.sender].voted = true; 

    }


    /**
        * @dev does not treat equal vote count.
    */
    function winningProposal() public view returns (uint winningProposalId){
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

    function checkSignature(bytes memory sig, bytes memory text, address sender) public pure returns (bool rez) {
        (bytes32 r, bytes32 s, uint8 v) = sigRSV(sig);
        bytes32 hashMsg = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", text));
        rez = (ecrecover(hashMsg, v, r, s) == sender);
    }
}