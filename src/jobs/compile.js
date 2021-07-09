module.exports = () => {
  const fs = require("fs");
  const path = require("path");
  const solc = require("solc");

  const contractPath = path.resolve(
    __dirname,
    "..",
    "contracts",
    "Lottery.sol"
  );
  const source = fs.readFileSync(contractPath, "utf-8");

  const compiled = solc.compile(source, 1);

  if (compiled.errors && compiled.errors.length) {
    throw new Error(
      `Contract could not compile, ${
        compiled.errors.length
      } error(s) found:\n${compiled.errors.join("\n")}`
    );
  }
  return compiled;
};
