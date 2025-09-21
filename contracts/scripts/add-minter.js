const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔄 Adding minter to ORO Badge contract...");

  // Contract address on Sepolia
  const contractAddress = "0x7fd112d62e3D32bD3667c878dfAf582B18d4266b";
  
  // Get the deployer account (contract owner)
  const [deployer] = await ethers.getSigners();
  console.log("Using account (owner):", deployer.address);

  // Connect to the deployed contract
  const OROBadge = await ethers.getContractFactory("OROBadge");
  const oroBadge = OROBadge.attach(contractAddress);

  // Check if deployer is already a minter
  const isAlreadyMinter = await oroBadge.minters(deployer.address);
  console.log("Is deployer already a minter?", isAlreadyMinter);

  if (!isAlreadyMinter) {
    // Add deployer as a minter
    console.log("\n📝 Adding deployer as minter...");
    const tx = await oroBadge.setMinter(deployer.address, true);
    console.log("Transaction hash:", tx.hash);

    // Wait for confirmation
    console.log("⏳ Waiting for confirmation...");
    await tx.wait();
    console.log("✅ Transaction confirmed!");

    // Verify the update
    const isNowMinter = await oroBadge.minters(deployer.address);
    console.log("Is deployer now a minter?", isNowMinter);
  } else {
    console.log("✅ Deployer is already a minter!");
  }

  // Test minting
  console.log("\n🧪 Testing minting...");
  try {
    const mintTx = await oroBadge.mintOrUpdate(deployer.address);
    console.log("Mint transaction hash:", mintTx.hash);
    
    console.log("⏳ Waiting for mint confirmation...");
    await mintTx.wait();
    console.log("✅ Mint successful!");

    // Check if badge was minted
    const isMinted = await oroBadge.isMinted(deployer.address);
    console.log("Is badge minted?", isMinted);

    // Get token ID
    const tokenId = await oroBadge.getTokenId(deployer.address);
    console.log("Token ID:", tokenId.toString());

    // Get token URI
    const tokenURI = await oroBadge.tokenURI(tokenId);
    console.log("Token URI:", tokenURI);

  } catch (error) {
    console.error("❌ Mint test failed:", error.message);
  }

  console.log("\n🎉 Minter setup complete!");
}

main().catch((error) => {
  console.error("❌ Setup failed:", error);
  process.exitCode = 1;
});
