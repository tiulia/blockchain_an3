require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let deployedTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    let token = await ethers.getContractAt("MyERC20", deployedTokenAddress)

    // Call some methods from the token
    let totalSupply = await token.totalSupply();
    console.log("total supply: ", totalSupply)

    let userBalance = await token.balanceOf(owner.address)
    console.log("user balance: ", userBalance)

    // Transfer funds from owner to user1

    // Check user 1 balance

    // Approve user 1 to spend from owner

    // Call transfer from to actually spend
}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });