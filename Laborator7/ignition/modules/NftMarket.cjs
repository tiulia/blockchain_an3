// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const FEE = 10;

module.exports = buildModule("NftMarket", (m) => {
  const fee = m.getParameter("_defaultMarketFee", FEE);

  const NftMarket = m.contract("NftMarket", [fee]);

  return { NftMarket };
});
