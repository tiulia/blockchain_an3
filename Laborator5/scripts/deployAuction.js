require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // Deploy Auction
    let auctionFactory = await ethers.getContractFactory("Auction");
    let auction = await auctionFactory.connect(owner).deploy();
    await auction.deployed();
    console.log("auction address: ", auction.address)

    // Deploy attacker contract
    let attackerFactory = await ethers.getContractFactory("AuctionAttacker");
    let attacker = await attackerFactory.connect(owner).deploy();
    await attacker.deployed();
    console.log("attacker address: ", attacker.address)
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });