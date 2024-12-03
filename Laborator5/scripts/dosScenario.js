require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function deploy() {
    // await ethers.provider.send('evm_miningInterval', [100]);
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // 1. Deploy AuctionBad.sol

    // 2. Call bid of AuctionBad Sc from user 1 with a msg.value > 0

    // 3. Deploy AuctionAttacker

    // 4. Call bid of AuctionAttacker SC with a value > highest bidder's value

    // 5. Try to call bid of AuctionBad from any user, it should revert
}


deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });