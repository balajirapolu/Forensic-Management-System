const ForensicEvidence = artifacts.require("ForensicEvidence");

module.exports = async function(deployer, network, accounts) {
  const targetAddress = '0x509EF8b0042BaDF288F462f775c0B6Db5E100c66';
  
  await deployer.deploy(ForensicEvidence, { from: targetAddress });
  const instance = await ForensicEvidence.deployed();
  
  console.log('Contract deployed to:', instance.address);
};
