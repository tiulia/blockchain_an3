require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let deployedTokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
    let token = await ethers.getContractAt("MyERC20", deployedTokenAddress)

    // Call some methods from the token
    let totalSupply = await token.totalSupply();
    console.log("total supply: ", ethers.utils.formatUnits(totalSupply, 0))

    let userBalance = await token.balanceOf(owner.address)
    console.log("user balance: ", userBalance)

    // Transfer funds from owner to user1
    let amount = ethers.utils.parseUnits("3", 8) // 3 * 10^8
    let transferTx = await token.connect(owner).transfer(user1.address, amount)
    await transferTx.wait()

    // Check user 1 balance
    userBalance = await token.balanceOf(owner.address)
    console.log("user balance: ", userBalance)

    // Approve user 1 to spend from owner
    console.log("Allowance before: ", await token.allowance(owner.address, user1.address))
    let approveTx = await token.connect(owner).approve(user1.address, amount)
    await approveTx.wait()
    console.log("Allowance after: ", await token.allowance(owner.address, user1.address))

    // Call transferFrom to actually spend
    userBalance = await token.balanceOf(user1.address)
    console.log("user balance before: ", userBalance)
    let transferFromTx = await token.connect(user1).transferFrom(owner.address, user1.address, amount)
    await transferFromTx.wait()
    userBalance = await token.balanceOf(user1.address)
    console.log("user balance after: ", userBalance)

    gasPrice = await ethers.provider.getGasPrice()
    console.log("Gas price: ", gasPrice)
    let transferGas = await token.connect(owner).estimateGas.transfer(user1.address, amount)
    console.log("Gas cost: ", transferGas)

    ethCost = gasPrice.mul(transferGas)
    console.log("gasPrice: ", gasPrice)
    console.log("transferGas: ", transferGas)
    console.log("EthCost: ", ethCost)

    ownerBalance = await ethers.provider.getBalance(owner.address)
    if (ownerBalance.gt(ethCost)) {
        console.log("Enough fees")
        let transferTx = await token.connect(owner).transfer(user1.address, amount)
        await transferTx.wait()
        console.log(transferTx)
    } else {
        console.log("Not enough fees")
    }

    let gasPrice = await ethers.provider.getGasPrice()
    console.log("Gas price: ", gasPrice)

    let sendAmount = ethers.utils.parseEther("10000")
    let sendTx = {
        to: user1.address,
        value: sendAmount
    }
    let sendGas = BigInt(21000)

    let ownerBalance = await ethers.provider.getBalance(owner.address)
    let ethCost = gasPrice.mul(sendGas).add(sendAmount)

    if (ownerBalance.gt(ethCost)) {
        console.log("Enough fees")
        await owner.sendTransaction(sendTx)
    } else {
        console.log("Not enough fees")
    }
    // await transferTx.wait()
}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });