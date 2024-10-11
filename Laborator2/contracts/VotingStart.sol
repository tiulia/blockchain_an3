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

    uint nonce;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    constructor() {
        chairperson = msg.sender;
        endRegister = block.timestamp + 30 days;
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

    function registerVoter(bytes32 registerToken) external returns (bytes32 votingToken){
        bytes32 randToken =  keccak256(abi.encodePacked(nonce, registerToken, block.timestamp));  
        voters[msg.sender].token = randToken;
        voters[msg.sender].voted = false;
        votingToken = keccak256(abi.encodePacked(randToken, msg.sender));
        nonce += 1;
    }

    function vote(uint[] memory votes, bytes32 signedToken) external{

        for(uint i = 0; i < votes.length; i++){
            proposals[votes[i]].voteCount += 1;
            voters[msg.sender].votes.push(votes[i]);
        }

        voters[msg.sender].voted = true; 

    }

    function winningProposal() public view returns (uint winningProposalId){
        winningProposalId = 0;
    }      
}