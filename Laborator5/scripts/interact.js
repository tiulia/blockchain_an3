require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let deployedIOCAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    let ico = await ethers.getContractAt("IOC", deployedIOCAddress)

    // let pauseTX = await ico.connect(user1).pause();
    // await pauseTX.wait()

    let unitPrice = await ico.unitPrice()
    console.log(unitPrice)
    let tokens = 1000
    console.log(tokens)
    let overwrite = {
        value : unitPrice.mul(tokens),
    }
    console.log("Old eth balance: ", await ico.getBalance())
    let buyTx = await ico.connect(user1).buy(tokens, overwrite)
    await buyTx.wait()
    console.log("New eth balance: ", await ico.getBalance())
}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });