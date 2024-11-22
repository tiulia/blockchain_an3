const { expect } = require("chai");
const hre = require("hardhat");
const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ICO contract Pausable", function () {

  async function deployTokenFixture() {
      const [owner, addr1, addr2] = await hre.ethers.getSigners();
      const tokens = 1000
      const price = 3
      const val = 150;
      const ico = await hre.ethers.deployContract("IOC", [tokens, price], {
        value: val, 
      });

      // Fixtures can return anything you consider useful for your tests
      return { ico, owner, addr1, addr2, val };
    }
  
  it("Should revert if not owner", async function () {
      const { ico, owner, addr1, addr2, val } = await loadFixture(
        deployTokenFixture
      );
    
      await expect(ico.connect(addr1).pause()).to.be.revertedWith("Ownable: Only owner can initiate transaction!");
    });  

  it("Can withdraw when paused", async function () {
      const { ico, owner, addr1, addr2, val } = await loadFixture(
        deployTokenFixture
      );

      await ico.pause();
      await ico.withdraw();

    });    




})
    
  
