// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DESCRIPTION = "PhotoNft";
const SYMBOL =  "ITM"

module.exports = buildModule("PhotoNft", (m) => {
  const description = m.getParameter("description", DESCRIPTION);
  const symbol = m.getParameter("description",  SYMBOL );

  const photoNft = m.contract("PhotoNft", [description, symbol]);

  return { photoNft };
});
