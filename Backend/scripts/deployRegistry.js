// import pkg from 'hardhat';
// const { ethers, run } = pkg;
// import fs from "fs";
// import path from "path";

// async function main() {
//   // Compile the contracts
//   await run("compile");

//   // Get the deployer wallet/signer
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying contract with address:", deployer.address);

//   // Get the contract factory
//   const TempleRegistry = await ethers.getContractFactory("TempleRegistry");

//   // Deploy the contract
//   const registry = await TempleRegistry.deploy();
//   await registry.waitForDeployment();

//   const registryAddress = await registry.getAddress();
//   console.log("TempleRegistry deployed at:", registryAddress);

//   // ⛽ Log gas used for deployment
//   const receipt = await registry.deploymentTransaction().wait();
//   console.log("⛽ Deployment gas used:", receipt.gasUsed.toString());

//   // Prepare addresses JSON path
//   const addressesPath = path.resolve("scripts", "deployedAddresses.json");

//   // Load existing addresses or initialize new object
//   const deployedAddresses = fs.existsSync(addressesPath)
//     ? JSON.parse(fs.readFileSync(addressesPath, "utf8"))
//     : {};

//   // Add contract address and deployer address
//   deployedAddresses.TempleRegistry = {
//     contractAddress: registryAddress,
//     deployedBy: deployer.address
//   };

//   // Save to JSON file
//   fs.writeFileSync(
//     addressesPath,
//     JSON.stringify(deployedAddresses, null, 2)
//   );

//   console.log("Addresses saved to scripts/deployedAddresses.json");
// }

// // Handle async/await properly
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("Deployment failed:", error);
//     process.exit(1);
//   });













import pkg from 'hardhat';
const { ethers, run } = pkg;
import fs from "fs";
import path from "path";

/**
 * Deploy NGORegistry Smart Contract
 * This contract manages NGO registration on the blockchain
 * TESTNET ONLY - For demonstration purposes
 */
async function main() {
  // Compile the contracts
  await run("compile");

  // Get the deployer wallet/signer
  const [deployer] = await ethers.getSigners();
  console.log("\n🚀 SmartNGO - Deploying NGORegistry Contract");
  console.log("Deployer address:", deployer.address);
  console.log("⚠️  TESTNET DEPLOYMENT - No real funds transferred\n");

  // Get the contract factory
  const NGORegistry = await ethers.getContractFactory("NGORegistry");

  // Deploy the contract
  const registry = await NGORegistry.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("✅ NGORegistry deployed at:", registryAddress);

  // ⛽ Log gas used for deployment
  const receipt = await registry.deploymentTransaction().wait();
  console.log("⛽ Deployment gas used:", receipt.gasUsed.toString());

  // Prepare addresses JSON path
  const addressesPath = path.resolve("scripts", "deployedAddresses.json");

  // Load existing addresses or initialize new object
  const deployedAddresses = fs.existsSync(addressesPath)
    ? JSON.parse(fs.readFileSync(addressesPath, "utf8"))
    : {};

  // Add contract address and deployer address
  deployedAddresses.NGORegistry = {
    contractAddress: registryAddress,
    deployedBy: deployer.address,
    network: "testnet",
    deployedAt: new Date().toISOString()
  };

  // Save to JSON file
  fs.writeFileSync(
    addressesPath,
    JSON.stringify(deployedAddresses, null, 2)
  );

  console.log("\n📝 Addresses saved to scripts/deployedAddresses.json");
  console.log("\n⚠️  Remember: This is a TESTNET deployment for demonstration only!");
}

// Handle async/await properly
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
