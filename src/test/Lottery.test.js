const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { compile } = require("../jobs");
const { contracts } = compile();

const web3 = new Web3(ganache.provider());

describe("Lottery", () => {
  let lottery, accounts;

  it("can get accounts", async () => {
    accounts = await web3.eth.getAccounts();
    assert.strictEqual(accounts instanceof Array && accounts.length > 0, true);
  });

  it("can deploy contract", async () => {
    const contract = contracts[":Lottery"];
    const { bytecode, interface: intf } = contract;

    lottery = await new web3.eth.Contract(JSON.parse(intf))
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: "1000000" });

    assert.ok(lottery.options.address);
  });

  it("can enter lottery", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.01", "ether") });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[1] });

    assert.strictEqual(players.includes(accounts[1]), true);
  });

  it("can restrict manager from entering lottery", async () => {
    try {
      await lottery.methods
        .enter()
        .send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });

      assert.fail("Manager cannot enter lottery");
    } catch (e) {
      assert(true);
    }
  });

  it("can restrict entering lottery with less than 0.01 ether", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei("0.0001", "ether"),
      });

      assert.fail("Value must be equal to or greater than 0.01 ether");
    } catch (e) {
      assert(true);
    }
  });

  it("can restrict only manager to call pick winner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] });
      assert(true);
    } catch (e) {
      assert.fail("Only manager can start pick winner");
    }
  });

  it("can reset lottery after payout", async () => {
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    const balance = await web3.eth.getBalance(lottery.options.address);

    assert.strictEqual(players.length, 0);
    assert.strictEqual(balance, "0");
  });
});
