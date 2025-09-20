const { ethers } = require("ethers");

async function main() {
  console.log("🔍 Checking ORO Badge baseMetadataURI...");

  // Contract address on Sepolia
  const contractAddress = "0x7fd112d62e3D32bD3667c878dfAf582B18d4266b";

  // Contract ABI (just the functions we need)
  const abi = [
    "function getBaseMetadataURI() view returns (string)",
    "function getTokenId(address wallet) pure returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
  ];

  // Use public RPC (no private key needed for read operations)
  const rpcUrl = "https://sepolia.infura.io/v3/0c92cb9be774484c9ee8ca5ecb753b46";

  // Create provider
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Connect to the deployed contract
  const oroBadge = new ethers.Contract(contractAddress, abi, provider);

  // Check current URI
  const currentURI = await oroBadge.getBaseMetadataURI();
  console.log("Current baseMetadataURI:", currentURI);

  // Test tokenURI generation with a sample address
  const testAddress = "0x1234567890123456789012345678901234567890";
  const testTokenId = await oroBadge.getTokenId(testAddress);
  const tokenURI = await oroBadge.tokenURI(testTokenId);
  console.log("\n🧪 Testing tokenURI generation:");
  console.log("Test address:", testAddress);
  console.log("Token ID:", testTokenId.toString());
  console.log("Generated tokenURI:", tokenURI);

  // Check if it's already pointing to our API
  if (currentURI.includes("orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app")) {
    console.log("\n✅ Contract is already pointing to the deployed API!");
  } else {
    console.log("\n⚠️  Contract needs to be updated to point to the deployed API");
    console.log("Expected URL: https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/metadata/");
  }
}

main().catch((error) => {
  console.error("❌ Check failed:", error);
  process.exitCode = 1;
});
