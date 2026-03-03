import pkg from 'hardhat';
const { ethers } = pkg;
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

/**
 * Register an NGO on the blockchain
 * TESTNET ONLY - For demonstration purposes
 */
async function main() {
  console.log("\n🚀 SmartNGO - Registering NGO");
  console.log("⚠️  TESTNET OPERATION - Simulated transaction\n");

  // Load deployed contract address
  const addressesPath = path.resolve("scripts", "deployedAddresses.json");
  
  if (!fs.existsSync(addressesPath)) {
    console.error("❌ deployedAddresses.json not found!");
    console.error("   Please deploy contracts first.");
    process.exit(1);
  }

  const deployed = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  
  if (!deployed.NGORegistry || !deployed.NGORegistry.contractAddress) {
    console.error("❌ NGORegistry address not found!");
    process.exit(1);
  }

  const contractAddress = deployed.NGORegistry.contractAddress;
  console.log("📋 NGORegistry Contract:", contractAddress);

  // Get signer from private key
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("👤 Platform Admin:", signer.address);

  // Get contract ABI
  const abiPath = path.resolve("artifacts", "contracts", "NGORegistry.sol", "NGORegistry.json");
  
  if (!fs.existsSync(abiPath)) {
    console.error("❌ Contract ABI not found!");
    console.error("   Run: npx hardhat compile");
    process.exit(1);
  }

  const contractABI = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

  // Connect to the contract
  const registry = new ethers.Contract(contractAddress, contractABI, signer);

  // Define NGO address to register (replace with actual NGO wallet address)
  const ngoAddress = process.env.NGO_WALLET_ADDRESS || "0x75BF063b574656c6C645615497A104482960E9Ae";
  
  console.log("\n🏢 Registering NGO:", ngoAddress);
  console.log("⏳ Sending transaction...\n");

  try {
    // Call the write function
    const tx = await registry.registerNGO(ngoAddress);
    console.log("📝 Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("\n✅ NGO registered successfully!");
    console.log("📦 Block Number:", receipt.blockNumber);
    console.log("⛽ Gas Used:", receipt.gasUsed.toString());
    
    // Verify registration
    const isRegistered = await registry.isRegistered(ngoAddress);
    console.log("\n🔍 Verification:", isRegistered ? "✅ Confirmed" : "❌ Failed");
    
    console.log("\n⚠️  Remember: This is a TESTNET transaction!");
  } catch (error) {
    console.error("\n❌ Registration failed:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
