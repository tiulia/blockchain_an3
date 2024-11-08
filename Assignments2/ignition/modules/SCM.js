// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SCM", (m) => {

    const packageRegistry= m.contract("PackageRegistry", []);
    const scm= m.contract("SCM", [packageRegistry]);

  
    return { packageRegistry, scm };
  });
