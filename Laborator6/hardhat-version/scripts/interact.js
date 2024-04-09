require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let testLibAddress = "0x9bAaB117304f7D6517048e371025dB8f89a8DbE5"
    let testLib = await ethers.getContractAt("TestLib", testLibAddress)

    let addUnsafeResult = await testLib.connect(owner).testAddUnsafe(255, 100)
    console.log(addUnsafeResult)
    let addSafeResult = await testLib.connect(owner).testAdd(255, 10);
    console.log(addSafeResult)

    let proxyAddress = testLibAddress
    proxyAddress[3] = "8"
    await testLib.connect(owner).testInitConstants(1e5, proxyAddress)

    let token = await testLib.connect(owner).testCreateToken(
        proxyAddress, testLibAddress, 1e6, proxyAddress
    )
    console.log(token)
}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });