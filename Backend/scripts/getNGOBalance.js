import pkg from 'hardhat';
const { ethers } = pkg;
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

/**
 * Get NGO balance from the blockchain
 * TESTNET ONLY - For demonstration purposes
 */
async function main() {
  console.log("\n💰 SmartNGO - Check NGO Balance");
  console.log("⚠️  TESTNET QUERY - Simulated funds\n");

  // Load deployed contract addresses
  const addressesPath = path.resolve("scripts", "deployedAddresses.json");
  
  if (!fs.existsSync(addressesPath)) {
    console.error("❌ deployedAddresses.json not found!");
    process.exit(1);
  }

  const deployed = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
  
  if (!deployed.NGOFund || !deployed.NGOFund.contractAddress) {
    console.error("❌ NGOFund address not found!");
    process.exit(1);
  }

  const contractAddress = deployed.NGOFund.contractAddress;
  console.log("📋 NGOFund Contract:", contractAddress);

  // Get provider
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || process.env.RPC_URL);

  // Get contract ABI
  const abiPath = path.resolve("artifacts", "contracts", "NGOFund.sol", "NGOFund.json");
  const contractABI = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

  // Connect to contract (read-only)
  const fundContract = new ethers.Contract(contractAddress, contractABI, provider);

  // NGO address to check (MODIFY THIS)
  const ngoAddress = process.env.NGO_WALLET_ADDRESS || "0x75BF063b574656c6C645615497A104482960E9Ae";
  
  console.log("🏢 NGO Address:", ngoAddress);
  console.log("⏳ Fetching balance...\n");

  try {
    // Get balance
    const balance = await fundContract.getNGOBalance(ngoAddress);
    const totalDonations = await fundContract.getTotalDonations(ngoAddress);
    const donorCount = await fundContract.getDonorCount(ngoAddress);
    
    console.log("📊 NGO Financial Summary:");
    console.log("   Current Balance:", ethers.formatEther(balance), "MATIC (testnet)");
    console.log("   Total Donations:", ethers.formatEther(totalDonations), "MATIC");
    console.log("   Unique Donors:", donorCount.toString());
    
    console.log("\n⚠️  Remember: These are TESTNET values!");
  } catch (error) {
    console.error("\n❌ Query failed:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
