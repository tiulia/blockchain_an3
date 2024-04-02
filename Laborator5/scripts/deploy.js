require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy ICO
    let icoFactory = await ethers.getContractFactory("IOC");
    let overwrite = {
        value : 1e15,
        // gasLimit: ,
        // gasPrice: 10000,
    }
    let ico = await icoFactory.connect(owner).deploy(5 * 1e10, 100, overwrite);
    await ico.deployed();
    console.log("ICO address: ", ico.address)


    // Deploy Caller
    let callsFactory = await ethers.getContractFactory("ContractCalls");
    let calls = await callsFactory.connect(user5).deploy(ico.address);
    await calls.deployed();
    console.log("Calls address: ", calls.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });