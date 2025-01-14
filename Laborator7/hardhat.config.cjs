require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: './.env.dev' });

const { VITE_RPC_URL, VITE_DEV_PRIVATE_KEY } = process.env;


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
      url: VITE_RPC_URL,
      accounts:  [VITE_DEV_PRIVATE_KEY] 
    }
  },
  defaultNetwork: "hardhat",

};
