require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner] = await ethers.getSigners();

    let tokenFactory = await ethers.getContractFactory("MyERC20");
    let supply = ethers.utils.parseUnits("50", 18); // 50 * 1e18
    let token = await tokenFactory.connect(owner).deploy(supply);
    await token.deployed();
    console.log("ERC20 address: ", token.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });