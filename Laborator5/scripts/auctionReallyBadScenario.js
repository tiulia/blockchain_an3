require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function scenario() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // 1. Deploy AuctionReallyBad.sol

    // 2. Bid as user 1

    // 3. Outbid user 1 as user 2

    // 4. Create an Attacker smart contract that is able
    // to withdraw all the funds from AuctionReallyBad

    // 5. Deploy Attacker

    // 6. Call the attack() method and withdraw all the funds
}


scenario()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });