module.exports = () => {
  const fs = require("fs");
  const path = require("path");
  const solc = require("solc");

  const contractPath = path.resolve(__dirname, "..", "contracts", "Lottery.sol");
  const source = fs.readFileSync(contractPath, "utf-8");

  return solc.compile(source, 1);
};
