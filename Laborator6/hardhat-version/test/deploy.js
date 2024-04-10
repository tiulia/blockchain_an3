const {ethers} = require("hardhat");
const common = require("./common.js");

describe("Deploy", function () {
    before(async function () {
        await ethers.provider.send("hardhat_setLoggingEnabled", [false]);
        await common.init()
    })

    beforeEach(async function () {

    })

    it("Description", async function () {

    });

    it("Description", async function () {

    });

})