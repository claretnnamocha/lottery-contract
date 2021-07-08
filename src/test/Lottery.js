const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { compile } = require("../jobs");
const { contracts } = compile();

const web3 = new Web3(ganache.provider());
let accounts;

describe("Lottery", () => {
  let lottery;

  it("can get accounts", async () => {
    accounts = await web3.eth.getAccounts();
    assert.strictEqual(accounts instanceof Array && accounts.length > 0, true);
  });

  it("can deploy contract", async () => {
    const contract = contracts[":Lottery"];
    const { bytecode, interface: intf } = contract;

    lottery = await new web3.eth.Contract(JSON.parse(intf))
      .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
      .send({ from: accounts[0], gas: "1000000" });

    assert.ok(lottery.options.address);
  });
});
