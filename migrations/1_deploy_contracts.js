const DRepo = artifacts.require("DRepo");

module.exports = function(deployer){
    deployer.deploy(DRepo);
};