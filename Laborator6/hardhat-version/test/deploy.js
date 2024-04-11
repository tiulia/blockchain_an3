const {ethers} = require("hardhat");
const common = require("./common.js");
const {max} = require("hardhat/internal/util/bigint");
const { expect } = require("chai");

describe("Play a game", function () {
    let owner, user1, user2, user3, user4, user5;
    let gameContract, tokenContract;

    before(async function () {
        await ethers.provider.send("hardhat_setLoggingEnabled", [false]);
        await common.init()

        owner = common.owner()
        user1 = common.user1()
        user2 = common.user2()
        user3 = common.user3()
        user4 = common.user4()
        user5 = common.user5()
    })

    beforeEach(async function () {
        let maxPlayers = 5;
        let gameFactory = await ethers.getContractFactory("Game")
        let game = await gameFactory.deploy(maxPlayers)
        await game.deployed()
        gameContract = game;

        let ercFactory = await ethers.getContractFactory("MyERC20")
        let token = await ercFactory.deploy(ethers.utils.parseEther("1000"))
        await token.deployed()
        tokenContract = token;

        let amount = ethers.utils.parseEther("1001")
        await expect(tokenContract.connect(owner).transfer(gameContract.address, amount)).
            to.be.revertedWith("Insufficient funds!")

        amount = ethers.utils.parseEther("50")
        let transferTx = await tokenContract.connect(owner).transfer(gameContract.address, amount)
        await transferTx.wait()

        let gameTokenBalance = await tokenContract.balanceOf(gameContract.address)
        await expect(gameTokenBalance).to.be.equal(amount);
    })

    it("Should end a game smoothly", async function () {
        // 1. Start a game
        let stake = ethers.utils.parseEther("0.1")
        let reward = ethers.utils.parseEther("50")
        let oldGameId = await gameContract.gameId();
        let startTx = await gameContract.connect(owner).startGame(stake, reward, tokenContract.address);
        await startTx.wait()

        await expect(await gameContract.gameId()).to.be.equal(oldGameId.add(1))
        let gameParams = await gameContract.gameParams(oldGameId)
        await expect(gameParams.gameStake).to.be.equal(stake)
        await expect(gameParams.gameReward).to.be.equal(reward)

        // 2. JoinGame de la 5 jucatori

        // 3. Round de 2 ori

        // 4. EndGame
    });

    it("Description", async function () {

    });

})