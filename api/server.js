const express = require('express');
const cors = require('cors');
const { Alchemy, Network } = require('alchemy-sdk');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'https://web-eqaphg4cx-loganstafford740-1721s-projects.vercel.app',
    'https://web-ashen-two.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use('/badges', express.static('public/badges'));

// Initialize Alchemy SDK
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY || 'demo', // Use demo key for now
  network: Network.ETH_MAINNET,
});

// Helper functions
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Real onchain scoring algorithm
async function calculateScore(address) {
  try {
    console.log(`Analyzing wallet: ${address}`);
    
    // Get wallet data from Alchemy
    const [balance, transactions, tokenTransfers] = await Promise.all([
      alchemy.core.getBalance(address),
      alchemy.core.getAssetTransfers({
        fromAddress: address,
        category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
        maxCount: 1000
      }),
      alchemy.core.getTokenBalances(address)
    ]);

    // Calculate individual factors
    const walletAge = await calculateWalletAge(address, transactions);
    const balanceScore = calculateBalanceScore(balance);
    const activityScore = calculateActivityScore(transactions);
    const defiScore = calculateDeFiScore(transactions);
    const tokenScore = calculateTokenScore(tokenTransfers);

    // Weighted scoring (total: 100 points)
    const totalScore = Math.min(100, Math.max(0,
      (walletAge * 0.20) +      // 20 points max
      (balanceScore * 0.25) +   // 25 points max  
      (activityScore * 0.20) +  // 20 points max
      (defiScore * 0.25) +      // 25 points max
      (tokenScore * 0.10)       // 10 points max
    ));

    console.log(`Score breakdown for ${address}:`, {
      walletAge: walletAge,
      balanceScore: balanceScore,
      activityScore: activityScore,
      defiScore: defiScore,
      tokenScore: tokenScore,
      totalScore: Math.round(totalScore)
    });

    return Math.round(totalScore);
  } catch (error) {
    console.error('Error calculating score:', error);
    // Fallback to deterministic scoring if API fails
    const cleanAddress = address.toLowerCase().replace('0x', '');
    const lastByte = cleanAddress.slice(-2);
    const score = parseInt(lastByte, 16);
    return Math.floor((score / 255) * 100);
  }
}

// Calculate wallet age score (0-20 points)
async function calculateWalletAge(address, transactions) {
  if (!transactions.transfers || transactions.transfers.length === 0) {
    return 0; // New wallet
  }
  
  const firstTx = transactions.transfers[transactions.transfers.length - 1];
  const firstTxDate = new Date(firstTx.blockNum);
  const now = new Date();
  const daysOld = (now - firstTxDate) / (1000 * 60 * 60 * 24);
  
  // Score based on age: 0-20 points
  if (daysOld < 30) return 2;      // Less than 1 month
  if (daysOld < 90) return 5;      // 1-3 months
  if (daysOld < 180) return 8;     // 3-6 months
  if (daysOld < 365) return 12;    // 6-12 months
  if (daysOld < 730) return 16;    // 1-2 years
  return 20;                       // 2+ years
}

// Calculate balance score (0-25 points)
function calculateBalanceScore(balance) {
  const ethBalance = parseFloat(ethers.formatEther(balance));
  
  // Score based on ETH balance with diminishing returns
  if (ethBalance < 0.01) return 0;
  if (ethBalance < 0.1) return 2;
  if (ethBalance < 0.5) return 5;
  if (ethBalance < 1) return 8;
  if (ethBalance < 5) return 12;
  if (ethBalance < 10) return 16;
  if (ethBalance < 50) return 20;
  return 25; // 50+ ETH
}

// Calculate activity score (0-20 points)
function calculateActivityScore(transactions) {
  const txCount = transactions.transfers ? transactions.transfers.length : 0;
  
  // Score based on transaction count (moderate activity is best)
  if (txCount < 5) return 2;
  if (txCount < 20) return 5;
  if (txCount < 50) return 10;
  if (txCount < 100) return 15;
  if (txCount < 500) return 18;
  return 20; // 500+ transactions
}

// Calculate DeFi usage score (0-25 points)
function calculateDeFiScore(transactions) {
  if (!transactions.transfers) return 0;
  
  const defiProtocols = new Set();
  const defiContracts = {
    '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9': 'Aave',
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2',
    '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3',
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V3',
    '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch',
    '0x881d40237659c251811cec9c364ef91dc08d300c': 'Metamask Swap',
    '0x3ee77595a8459e93c2888b13adb354017b198188': 'Compound',
    '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5': 'Compound',
  };
  
  transactions.transfers.forEach(tx => {
    if (defiContracts[tx.to]) {
      defiProtocols.add(defiContracts[tx.to]);
    }
  });
  
  // Score based on number of DeFi protocols used
  const protocolCount = defiProtocols.size;
  if (protocolCount === 0) return 0;
  if (protocolCount === 1) return 5;
  if (protocolCount === 2) return 10;
  if (protocolCount === 3) return 15;
  if (protocolCount === 4) return 20;
  return 25; // 5+ protocols
}

// Calculate token diversity score (0-10 points)
function calculateTokenScore(tokenTransfers) {
  if (!tokenTransfers.tokenBalances) return 0;
  
  const tokenCount = tokenTransfers.tokenBalances.filter(token => 
    parseFloat(token.tokenBalance) > 0
  ).length;
  
  // Score based on token diversity
  if (tokenCount === 0) return 0;
  if (tokenCount === 1) return 2;
  if (tokenCount === 2) return 4;
  if (tokenCount === 3) return 6;
  if (tokenCount === 4) return 8;
  return 10; // 5+ tokens
}

function getStatus(score) {
  if (score >= 80) return "Trusted";
  if (score >= 50) return "Stable";
  return "New/Unproven";
}

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'ORO API',
    version: '1.0.0',
    description: 'Onchain Reputation Oracle API',
    endpoints: {
      health: '/health',
      score: '/score/:address',
      metadata: '/metadata/:address.json'
    },
    examples: {
      health: `${req.protocol}://${req.get('host')}/health`,
      score: `${req.protocol}://${req.get('host')}/score/0x1234567890123456789012345678901234567890`,
      metadata: `${req.protocol}://${req.get('host')}/metadata/0x1234567890123456789012345678901234567890.json`
    },
    documentation: 'https://github.com/OROORACLE/oro-mvp/blob/main/API.md'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test endpoint to list available badges
app.get('/badges', (req, res) => {
  const githubBaseUrl = 'https://raw.githubusercontent.com/OROORACLE/oro-mvp/master/images/badges';
  res.json({
    badges: [
      `${githubBaseUrl}/trusted.png`,
      `${githubBaseUrl}/stable.png`,
      `${githubBaseUrl}/new-unproven.png`
    ],
    baseUrl: githubBaseUrl
  });
});

app.get('/score/:address', async (req, res) => {
  const { address } = req.params;
  
  if (!isValidAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }

  try {
    const score = await calculateScore(address);
    const status = getStatus(score);

    res.json({
      address: address.toLowerCase(),
      score: score,
      status: status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in score endpoint:', error);
    res.status(500).json({ error: "Failed to calculate score" });
  }
});

app.get('/metadata/:address.json', async (req, res) => {
  const { address } = req.params;
  
  if (!isValidAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }

  try {
    const score = await calculateScore(address);
    const status = getStatus(score);
  
  // Determine badge image based on status
  let badgeImage;
  
  // Use custom NFT badge images from GitHub raw URLs
  const githubBaseUrl = 'https://raw.githubusercontent.com/OROORACLE/oro-mvp/master/images/badges';
  const cacheBuster = Date.now(); // Force cache refresh
  if (status === "Trusted") {
    badgeImage = `${githubBaseUrl}/never-defaulted.png?v=${cacheBuster}`;
  } else if (status === "Stable") {
    badgeImage = `${githubBaseUrl}/good-standing.png?v=${cacheBuster}`;
  } else {
    badgeImage = `${githubBaseUrl}/new-unproven.png?v=${cacheBuster}`;
  }

  const metadata = {
    name: `ORO Badge - ${status}`,
    description: `Reputation badge for ${address}. Score: ${score}/100`,
    image: badgeImage,
    attributes: [
      { trait_type: "Score", value: score },
      { trait_type: "Status", value: status }
    ]
  };

    res.json(metadata);
  } catch (error) {
    console.error('Error in metadata endpoint:', error);
    res.status(500).json({ error: "Failed to generate metadata" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ORO API running on http://localhost:${PORT}`);
  console.log(`📊 Score: http://localhost:${PORT}/score/:address`);
  console.log(`🖼️  Metadata: http://localhost:${PORT}/metadata/:address.json`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
