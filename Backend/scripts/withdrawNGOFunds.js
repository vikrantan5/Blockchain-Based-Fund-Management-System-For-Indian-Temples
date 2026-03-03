import pkg from 'hardhat';
const { ethers } = pkg;
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

/**
 * Simulate NGO fund withdrawal
 * TESTNET ONLY - For demonstration purposes
 */
async function main() {
  console.log("\n💸 SmartNGO - NGO Withdrawal");
  console.log("⚠️  TESTNET OPERATION - Simulated transaction\n");

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

  // Get signer (NGO Manager)
  const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || process.env.RPC_URL);
  const ngoManager = new ethers.Wallet(process.env.NGO_PRIVATE_KEY || process.env.PRIVATE_KEY, provider);
  console.log("👤 NGO Manager:", ngoManager.address);

  // Get contract ABI
  const abiPath = path.resolve("artifacts", "contracts", "NGOFund.sol", "NGOFund.json");
  const contractABI = JSON.parse(fs.readFileSync(abiPath, "utf8")).abi;

  // Connect to contract
  const fundContract = new ethers.Contract(contractAddress, contractABI, ngoManager);

  // Withdrawal parameters (MODIFY THESE)
  const withdrawAmount = ethers.parseEther("0.005"); // 0.005 testnet MATIC
  const purpose = "Medical Supplies Purchase";

  console.log("\n💸 Withdrawal Details:");
  console.log("   Amount:", ethers.formatEther(withdrawAmount), "MATIC (testnet)");
  console.log("   Purpose:", purpose);
  console.log("\n⏳ Processing withdrawal...\n");

  try {
    // Check current balance first
    const currentBalance = await fundContract.getNGOBalance(ngoManager.address);
    console.log("💰 Current Balance:", ethers.formatEther(currentBalance), "MATIC");
    
    if (currentBalance < withdrawAmount) {
      console.error("❌ Insufficient funds for withdrawal!");
      process.exit(1);
    }

    // Perform withdrawal
    const tx = await fundContract.withdrawFunds(withdrawAmount, purpose);
    
    console.log("📝 Transaction Hash:", tx.hash);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("\n✅ Withdrawal successful!");
    console.log("📦 Block Number:", receipt.blockNumber);
    console.log("⛽ Gas Used:", receipt.gasUsed.toString());
    
    // Check updated balance
    const newBalance = await fundContract.getNGOBalance(ngoManager.address);
    console.log("\n💰 New Balance:", ethers.formatEther(newBalance), "MATIC");
    
    console.log("\n⚠️  Remember: This is a TESTNET transaction!");
  } catch (error) {
    console.error("\n❌ Withdrawal failed:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
