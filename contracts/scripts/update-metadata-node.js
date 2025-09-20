const { ethers } = require("ethers");

async function main() {
  console.log("🔄 Updating ORO Badge baseMetadataURI...");

  // Contract address on Sepolia
  const contractAddress = "0x7fd112d62e3D32bD3667c878dfAf582B18d4266b";
  
  // New API URL
  const newBaseMetadataURI = "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/metadata/";

  // Contract ABI (just the functions we need)
  const abi = [
    "function getBaseMetadataURI() view returns (string)",
    "function setBaseMetadata(string newBaseMetadataURI)",
    "function getTokenId(address wallet) pure returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
  ];

  // Use the private key directly
  const privateKey = "0xa7dd16a6f9dd48308c0614ca022451869f61a2a03325cbd9dbd46455b7d1e8f9";
  const rpcUrl = "https://sepolia.infura.io/v3/0c92cb9be774484c9ee8ca5ecb753b46";

  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Using account:", wallet.address);

  // Connect to the deployed contract
  const oroBadge = new ethers.Contract(contractAddress, abi, wallet);

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
  const testAddress = wallet.address;
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
