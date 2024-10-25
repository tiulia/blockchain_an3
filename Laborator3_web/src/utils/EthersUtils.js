const ethers = require('ethers');

const provider = new ethers.BrowserProvider(window.ethereum);

const scanprovider = new ethers.EtherscanProvider("sepolia");

const connectWalletMetamask = async (accountChangedHandler) => {
  if (window.ethereum) {
    try {
      await provider.send("eth_requestAccounts", []);
      
      let signer;
      
      while (!signer) {
        signer = await provider.getSigner().catch(() => null);
        if (signer) {
          accountChangedHandler(signer);
          break;
        } else {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (err) {
      console.log("Error while requesting accounts or retrieving signer:", err);
    }
  } else {
    console.log("Ethereum provider not found");
  }
}


const fetchTransactions = async (account) => {
  return [];
};


const fetchProposals = async (votingContract) => {
  const eventFilter = votingContract.filters.ProposalAdded();
  const fromBlock = 0;
  const toBlock = 'latest';

  const events = await votingContract.queryFilter(eventFilter, 
         fromBlock, toBlock);
  
         console.log(events);
  return events.map(event => ({
           proposer: event.args.proposer, 
           participant1: event.args.participant1, 
           participant2: event.args.participant2,
           teamName: event.args.teamName
         }));
}


const initializeContract = (contractAddress, contractABI) => {
  return new ethers.Contract(contractAddress, contractABI, provider);
}

module.exports = {
  provider,
  connectWalletMetamask,
  fetchTransactions,
  fetchProposals,
  initializeContract
};


