module.exports = async () => {
  const HDWalletProvider = require("truffle-hdwallet-provider");
  const Web3 = require("web3");
  const compile = require("./compile");
  const { contracts } = compile();

  // Inbox Contract
  const contract = contracts[":Lottery"];
  const { bytecode, interface: intf } = contract;

  const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.PROVIDER_ENDPOINT
  );

  const web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();
  return await new web3.eth.Contract(JSON.parse(intf))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
};
