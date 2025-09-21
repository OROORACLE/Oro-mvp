const { ethers } = require("hardhat");

async function main() {
  console.log("🔄 Adding minter to ORO Badge contract...");

  // Contract address on Sepolia
  const contractAddress = "0x7fd112d62e3D32bD3667c878dfAf582B18d4266b";
  
  // Your credentials
  const RPC_URL = "https://sepolia.infura.io/v3/0c92cb9be774484c9ee8ca5ecb753b46";
  const PRIVATE_KEY = "0xa7dd16a6f9dd48308c0614ca022451869f61a2a03325cbd9dbd46455b7d1e8f9";
  
  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log("Using account (owner):", wallet.address);

  // Connect to the deployed contract
  const OROBadge = await ethers.getContractFactory("OROBadge");
  const oroBadge = OROBadge.attach(contractAddress).connect(wallet);

  // Check if wallet is already a minter
  const isAlreadyMinter = await oroBadge.minters(wallet.address);
  console.log("Is wallet already a minter?", isAlreadyMinter);

  if (!isAlreadyMinter) {
    // Add wallet as a minter
    console.log("\n📝 Adding wallet as minter...");
    const tx = await oroBadge.setMinter(wallet.address, true);
    console.log("Transaction hash:", tx.hash);

    // Wait for confirmation
    console.log("⏳ Waiting for confirmation...");
    await tx.wait();
    console.log("✅ Transaction confirmed!");

    // Verify the update
    const isNowMinter = await oroBadge.minters(wallet.address);
    console.log("Is wallet now a minter?", isNowMinter);
  } else {
    console.log("✅ Wallet is already a minter!");
  }

  // Test minting
  console.log("\n🧪 Testing minting...");
  try {
    const mintTx = await oroBadge.mintOrUpdate(wallet.address);
    console.log("Mint transaction hash:", mintTx.hash);
    
    console.log("⏳ Waiting for mint confirmation...");
    await mintTx.wait();
    console.log("✅ Mint successful!");

    // Check if badge was minted
    const isMinted = await oroBadge.isMinted(wallet.address);
    console.log("Is badge minted?", isMinted);

    // Get token ID
    const tokenId = await oroBadge.getTokenId(wallet.address);
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
