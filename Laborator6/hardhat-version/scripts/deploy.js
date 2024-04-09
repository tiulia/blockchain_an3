require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    let libFactory = await ethers.getContractFactory("Lib");
    let lib = await libFactory.connect(user5).deploy();
    await lib.deployed();
    console.log("lib address: ", lib.address)

    // Deploy TestLib
    let TestLibFactory = await ethers.getContractFactory("TestLib", {
        libraries: {
            Lib: lib.address,
        }
    });
    let testLib = await TestLibFactory.connect(user5).deploy();
    await testLib.deployed();
    console.log("testLib address: ", testLib.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });