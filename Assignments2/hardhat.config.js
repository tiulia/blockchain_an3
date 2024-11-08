require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",

  networks: {
    hardhat: {
      gas: "auto",
      mining: {
        auto: true,
        interval: 2000, //ms
      }
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/<ApiKey>",
      accounts: ["PrivateKey1", "PrivateKey2"]
    }
  },
  defaultNetwork: "hardhat",

};
