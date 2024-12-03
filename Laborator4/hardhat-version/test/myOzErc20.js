require("@nomicfoundation/hardhat-ethers");
const {expect} = require("chai");
const {ethers} = require("hardhat");


describe("Token contract", function () {
    let token;
    let owner, user1, user2;

    before(async function() {
        [owner, user1, user2] = await ethers.getSigners();

    })

    beforeEach(async function() {
        // deploy myOZERc
        let tokenFactory = await ethers.getContractFactory("MyOZERC20");
        let supply = ethers.parseEther("1000")
        token = await tokenFactory.connect(owner).deploy("Name", "SYM", supply);
        await token.waitForDeployment()
    })

    it("Should test mint functionalities", async function () {
        let mintTx = await token.connect(owner).mint(owner.address, BigInt(1000))
        await mintTx.wait()
        // call mint

        // check new amount and total supply

        // call mint from non owner and expect revertedWith
        await expect(token.connect(user1).mint(owner.address, BigInt(1000))).to.be.
            revertedWithCustomError(token, 'OwnableUnauthorizedAccount').
            withArgs(user1.address);

    });


    it("Should transfer tokens between accounts", async function() {

    });
});
