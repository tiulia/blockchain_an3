require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner] = await ethers.getSigners();

    let deployedTokenAddress = "0x160c598570d57B6D7A58e480b8a6018F9e97DC58"
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