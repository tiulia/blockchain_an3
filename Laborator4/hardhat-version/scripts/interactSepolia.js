require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner] = await ethers.getSigners();

    let deployedTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    let token = await ethers.getContractAt("MyERC20", deployedTokenAddress)

    // Call some methods from the token
    let totalSupply = await token.totalSupply();
    console.log("total supply: ", totalSupply)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });