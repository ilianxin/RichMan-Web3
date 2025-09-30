const hre = require("hardhat");

async function main() {
  console.log("Deploying RichManGame contract...");

  const RichManGame = await hre.ethers.getContractFactory("RichManGame");
  const game = await RichManGame.deploy();

  await game.waitForDeployment();

  const address = await game.getAddress();
  console.log("RichManGame deployed to:", address);

  // Save contract address and ABI
  const fs = require("fs");
  const contractsDir = "./src/assets/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ RichManGame: address }, undefined, 2)
  );

  const RichManGameArtifact = await hre.artifacts.readArtifact("RichManGame");

  fs.writeFileSync(
    contractsDir + "/RichManGame.json",
    JSON.stringify(RichManGameArtifact, null, 2)
  );

  console.log("Contract address and ABI saved to src/assets/contracts/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
