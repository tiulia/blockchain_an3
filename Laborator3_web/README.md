# Activity 3: Creating a Supply Chain Management platform.

## Solidity basics

### Events

Events are used in Solidity to store logs. Each event has a name and arguments. Arguments are stored along with contract address in a special data structure, a log Patricia Merkle data structure. Up to three parameters can be indexed. These arguments are “topics”. A topic can store a single word (32 bytes) and allow searching for events. Web3 applications usually subscribe to events topics. Events can be also filtered by the address of the contract that emitted the events. Storing data in logs cost less gas than storing data in storage.

Keywords:
- **event**
- **emit**

## Voting dApp.

![Img](https://bafybeihvrzgcqpciwzfkyqzlmcut7r3gaulmzawctiwirt3eclshaakoxy.ipfs.w3s.link/VotingContractInteraction.png)


## Exercises
1. **List of transactions** Complete the definition of fetchTransactions in EthersUtils.js.


2.  **List of events** Complete the definition of fetchProposals in EthersUtils.js


### Docs: 
[1] https://docs.ethers.org/v5/concepts/events/

[2] https://docs.chainstack.com/docs/ethereum-logs-tutorial-series-logs-and-filters

