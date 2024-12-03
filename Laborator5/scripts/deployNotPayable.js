require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    // await ethers.provider.send('evm_miningInterval', [100]);
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    let ICOFactory = await ethers.getContractFactory("IOCNotPayable");
    let overwrite = {
        value: ethers.utils.parseEther("0.01")
    }
    let ico = await ICOFactory.connect(owner).deploy(3e8, 5, overwrite);
    await ico.deployed();
    console.log("ICO address: ", ico.address)

    let contractBalance = await ico.getBalance()
    console.log("ICO ETH balance: ", ethers.utils.formatEther(contractBalance))

    let ccFactory = await ethers.getContractFactory("ContractCalls")
    let cc = await ccFactory.connect(owner).deploy(ico.address)
    await cc.deployed()

    console.log("CC address:" , cc.address)
    console.log("User1 addr: ", user1.address)

    console.log("Script call Receive")
    let callTx = await cc.connect(user1).callReceive({value: 151})
    await callTx.wait()

    console.log("Script call Fallback")
    let callFallback = await cc.connect(user1).callFallback({value: 87})
    await callFallback.wait()

    console.log("Script call Transfer")
    let callT = await cc.connect(user1).callTransfer({value: 51, gasLimit: 1e6})
    console.log(callT)
    await callT.wait()

    console.log("Script call Send")
    let callS = await cc.connect(user1).callSend({value: 36})
    await callS.wait()
}


deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });