import pkg from 'hardhat';
const { ethers } = pkg;
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

/**
 * Simulate a donation to an NGO
 * TESTNET ONLY - For demonstration purposes
 */
async function main() {
  console.log("\n💝 SmartNGO - Simulated Donation");
  console.log("⚠️  TESTNET OPERATION - No real funds transferred\n");

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

  // Get signer (donor)
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || process.env.RPC_URL);
  const donor = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("👤 Donor Address:", donor.address);

  // Get contract ABI
  const abiPath = path.resolve("artifacts", "contracts", "NGOFund.sol", "NGOFund.json");
  const contractABI = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

  // Connect to contract
  const fundContract = new ethers.Contract(contractAddress, contractABI, donor);

  // Donation parameters (MODIFY THESE)
  const ngoAddress = process.env.NGO_WALLET_ADDRESS || "0x75BF063b574656c6C645615497A104482960E9Ae";
  const donationAmount = ethers.parseEther("0.01"); // 0.01 testnet MATIC
  const purpose = "Education Support Program";

  console.log("\n💝 Donation Details:");
  console.log("   NGO Address:", ngoAddress);
  console.log("   Amount:", ethers.formatEther(donationAmount), "MATIC (testnet)");
  console.log("   Purpose:", purpose);
  console.log("\n⏳ Processing donation...\n");

  try {
    // Make donation
    const tx = await fundContract.donateToNGO(ngoAddress, purpose, {
      value: donationAmount
    });
    
    console.log("📝 Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("\n✅ Donation successful!");
    console.log("📦 Block Number:", receipt.blockNumber);
    console.log("⛽ Gas Used:", receipt.gasUsed.toString());
    
    // Check updated balance
    const ngoBalance = await fundContract.getNGOBalance(ngoAddress);
    console.log("\n💰 NGO Current Balance:", ethers.formatEther(ngoBalance), "MATIC");
    
    console.log("\n⚠️  Remember: This is a TESTNET transaction!");
  } catch (error) {
    console.error("\n❌ Donation failed:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
