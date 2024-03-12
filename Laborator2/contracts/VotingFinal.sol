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

    mapping(address => Voter) public voters;
    mapping(bytes32 => address) voteTokens;

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


    function registerVoter(bytes32 givenToken) external returns (bytes32 generatedToken){
        generatedToken =  keccak256(abi.encodePacked(givenToken, msg.sender));
        voters[msg.sender].token = generatedToken;
        voters[msg.sender].voted = false;
        voteTokens[generatedToken] = msg.sender;

    }


    function vote(uint[] memory votes, bytes32 token) external{
        require (voteTokens[token] == msg.sender, "Invalid token"); 
        
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
}