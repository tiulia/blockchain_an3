const MyOZERC20 = artifacts.require("./MyOZERC20.sol");

module.exports = function (deployer) {
  deployer.deploy(MyOZERC20, "MyOZERC20", "TOP", 100);
};
