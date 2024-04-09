require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let deployedIOCAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    let ico = await ethers.getContractAt("IOC", deployedIOCAddress)

    let deployedCallsAddress = "0x0116686e2291dbd5e317f47fadbfb43b599786ef"
    let calls = await ethers.getContractAt("ContractCalls", deployedCallsAddress)

    let overwrite = {
        value: ethers.utils.parseEther("5")
    }

    // CallTransfer
    console.log("Old eth balance: ", await ico.getBalance())
    let callTransferTx = await calls.connect(user1).callTransfer(overwrite)
    await callTransferTx.wait()
    console.log("New eth balance: ", await ico.getBalance())

    let callTransferReceipt = await ethers.provider.getTransactionReceipt(callTransferTx.hash)
    console.log(callTransferReceipt.logs[0].topics)
    console.log(callTransferReceipt.logs[0].data)

    // CallSend
    console.log("Old eth balance: ", await ico.getBalance())
    let callSendTx = await calls.connect(user1).callSend()
    await callSendTx.wait()
    console.log("New eth balance: ", await ico.getBalance())

    let callSendReceipt = await ethers.provider.getTransactionReceipt(callSendTx.hash)
    console.log(callSendReceipt.logs[0].topics)
    console.log(callSendReceipt.logs[0].data)

    // CallFallback
    console.log("Old eth balance: ", await ico.getBalance())
    let callFallBackTx = await calls.connect(user1).callFallback()
    await callFallBackTx.wait()
    console.log("New eth balance: ", await ico.getBalance())

    let callFallBackReceipt = await ethers.provider.getTransactionReceipt(callFallBackTx.hash)
    console.log(callFallBackReceipt.logs[0].topics)
    console.log(callFallBackReceipt.logs[0].data)
}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });