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
 
  return [];
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


