const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔄 Updating ORO Badge baseMetadataURI...");

  // Contract address on Sepolia
  const contractAddress = "0x7fd112d62e3D32bD3667c878dfAf582B18d4266b";
  
  // New API URL
  const newBaseMetadataURI = "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/metadata/";

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Connect to the deployed contract
  const OROBadge = await ethers.getContractFactory("OROBadge");
  const oroBadge = OROBadge.attach(contractAddress);

  // Check current URI
  const currentURI = await oroBadge.getBaseMetadataURI();
  console.log("Current baseMetadataURI:", currentURI);
  console.log("New baseMetadataURI:", newBaseMetadataURI);

  // Update the baseMetadataURI
  console.log("\n📝 Updating baseMetadataURI...");
  const tx = await oroBadge.setBaseMetadata(newBaseMetadataURI);
  console.log("Transaction hash:", tx.hash);

  // Wait for confirmation
  console.log("⏳ Waiting for confirmation...");
  await tx.wait();
  console.log("✅ Transaction confirmed!");

  // Verify the update
  const updatedURI = await oroBadge.getBaseMetadataURI();
  console.log("Updated baseMetadataURI:", updatedURI);

  // Test tokenURI generation
  const testAddress = deployer.address;
  const testTokenId = await oroBadge.getTokenId(testAddress);
  const tokenURI = await oroBadge.tokenURI(testTokenId);
  console.log("\n🧪 Testing tokenURI generation:");
  console.log("Test address:", testAddress);
  console.log("Token ID:", testTokenId.toString());
  console.log("Generated tokenURI:", tokenURI);

  console.log("\n🎉 BaseMetadataURI updated successfully!");
  console.log("Contract now points to:", newBaseMetadataURI);
}

main().catch((error) => {
  console.error("❌ Update failed:", error);
  process.exitCode = 1;
});
