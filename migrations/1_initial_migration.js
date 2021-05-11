const Anft = artifacts.require("Anft");

module.exports = function(deployer) {
  deployer.deploy(Anft, 'stringurl');
};
