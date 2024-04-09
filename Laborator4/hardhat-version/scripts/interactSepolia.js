require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner] = await ethers.getSigners();

    let deployedTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    let token = await ethers.getContractAt("MyERC20", deployedTokenAddress)

    // Call some methods from the token
    let totalSupply = await token.totalSupply();
    console.log("total supply: ", totalSupply)

    console.log(await token.balanceOf(user1.address))

    let estimatedGas = await token.connect(owner).estimateGas.transfer(user1.address, amount)
    console.log(estimatedGas)
    let gasPrice = await ethers.provider.getGasPrice()
    console.log(gasPrice)
    let costInWei = estimatedGas.mul(gasPrice)
    console.log(costInWei) // cost in wei
    console.log(ethers.utils.formatEther(costInWei)) // prince in ETH
    console.log(ethers.utils.formatEther(costInWei.mul(3500))) // price in $

    let ownerEthBalance = await ethers.provider.getBalance(owner.address)
    if(ownerEthBalance.gt(costInWei)) {
        let amount = ethers.utils.parseUnits("3", 8) // 3 * 10^8
        let transferTx = await token.connect(owner).transfer(user1.address, amount)
        await transferTx.wait()
    } else {
        console.log("Not enough ETH balance")
    }
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });