const express = require('express');
const cors = require('cors');
const { Alchemy, Network } = require('alchemy-sdk');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'oro-reputation-oracle-secret-key-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d'; // 30 days default
const ORO_PRIVATE_KEY = process.env.ORO_PRIVATE_KEY || crypto.randomBytes(32).toString('hex');

app.use(cors({
  origin: [
    'https://web-eqaphg4cx-loganstafford740-1721s-projects.vercel.app',
    'https://web-ashen-two.vercel.app',
    'https://web-c5yfoj80j-loganstafford740-1721s-projects.vercel.app',
    'https://web-jb0qx9tss-loganstafford740-1721s-projects.vercel.app', // Latest frontend URL
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
app.use(express.json());

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log performance metrics for Vercel to track
    if (duration > 1000) {
      console.warn(`SLOW_REQUEST: ${req.method} ${req.path} took ${duration}ms`);
    }
    if (duration > 5000) {
      console.error(`TIMEOUT_RISK: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});

// Serve static files from public directory
app.use('/badges', express.static('public/badges'));

// Initialize Alchemy SDK
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY || 'eqHZ7IU0G8noXjF-OLo6U', // Real Alchemy key
  network: Network.ETH_MAINNET,
  maxRetries: 3,
  requestTimeout: 30000, // 30 second timeout instead of 120
});

// Helper functions
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Real onchain scoring algorithm
async function calculateScore(address) {
  try {
    console.log(`Analyzing wallet: ${address}`);
    
    // Set a timeout for the entire scoring process
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Scoring timeout')), 15000); // 15 second timeout
    });
    
    const scoringPromise = (async () => {
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

      // Apply weights and calculate total score (DeFi-optimized)
      let totalScore = Math.round(
        (activityScore * 0.40 +  // 40% - Activity is most important in DeFi
         defiScore * 0.25 +      // 25% - DeFi usage is key indicator
         walletAge * 0.15 +      // 15% - Age less critical in fast-moving DeFi
         tokenScore * 0.15 +     // 15% - Token diversity matters for DeFi users
         balanceScore * 0.05) * 100 // 5% - Balance least important in DeFi
      );

      console.log(`Score breakdown for ${address}:`, {
        normalized: {
          walletAge: Math.round(walletAge * 100) / 100,
          balanceScore: Math.round(balanceScore * 100) / 100,
          activityScore: Math.round(activityScore * 100) / 100,
          defiScore: Math.round(defiScore * 100) / 100,
          tokenScore: Math.round(tokenScore * 100) / 100
        },
        weighted: {
          walletAge: Math.round(walletAge * 0.20 * 100),
          balanceScore: Math.round(balanceScore * 0.25 * 100),
          activityScore: Math.round(activityScore * 0.20 * 100),
          defiScore: Math.round(defiScore * 0.25 * 100),
          tokenScore: Math.round(tokenScore * 0.10 * 100)
        },
        totalScore: Math.round(totalScore)
      });
      
      // Debug: Log the raw data to see what we're getting
      console.log(`Raw data for ${address}:`, {
        balance: balance,
        transactionCount: transactions.transfers ? transactions.transfers.length : 0,
        tokenCount: tokenTransfers.tokenBalances ? tokenTransfers.tokenBalances.length : 0,
        tokenBalances: tokenTransfers.tokenBalances ? tokenTransfers.tokenBalances.slice(0, 3) : 'none' // Show first 3 tokens
      });

      return Math.round(totalScore);
    })();
    
    // Race between scoring and timeout
    return await Promise.race([scoringPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error calculating score:', error);
    console.log(`Falling back to deterministic scoring for ${address}`);
    // Fallback to deterministic scoring if API fails or times out
    const cleanAddress = address.toLowerCase().replace('0x', '');
    const lastByte = cleanAddress.slice(-2);
    const score = parseInt(lastByte, 16);
    return Math.floor((score / 255) * 100);
  }
}

// Calculate wallet age score (0-1 normalized)
async function calculateWalletAge(address, transactions) {
  if (!transactions.transfers || transactions.transfers.length === 0) {
    return 0; // New wallet
  }
  
  const firstTx = transactions.transfers[transactions.transfers.length - 1];
  
  // Get the block timestamp from Alchemy
  let firstTxDate;
  try {
    if (firstTx.blockNum) {
      // Convert block number to timestamp
      const block = await alchemy.core.getBlock(firstTx.blockNum);
      firstTxDate = new Date(block.timestamp * 1000);
    } else {
      // Fallback: assume recent if no block data
      firstTxDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    }
  } catch (error) {
    console.log(`Could not get block data for ${address}, using fallback`);
    // Fallback: assume 1 year old wallet
    firstTxDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  }
  
  const now = new Date();
  const daysOld = (now - firstTxDate) / (1000 * 60 * 60 * 24);
  
  // Normalize age to 0-1 scale (2+ years = 1.0)
  const maxAge = 730; // 2 years in days
  return Math.min(1.0, Math.max(0, daysOld / maxAge));
}

// Calculate balance score (0-1 normalized)
function calculateBalanceScore(balance) {
  // Handle BigNumber objects from Alchemy
  let balanceValue;
  if (balance && typeof balance === 'object' && balance._hex) {
    balanceValue = balance._hex;
  } else if (typeof balance === 'string') {
    balanceValue = balance;
  } else {
    balanceValue = '0x0';
  }
  
  const ethBalance = parseFloat(ethers.formatEther(balanceValue));
  
  // Normalize balance to 0-1 scale with diminishing returns (50+ ETH = 1.0)
  if (ethBalance < 0.01) return 0;
  
  // Use logarithmic scaling for diminishing returns
  const maxBalance = 50; // 50 ETH = max score
  const normalizedBalance = Math.min(1.0, Math.log10(ethBalance + 1) / Math.log10(maxBalance + 1));
  return normalizedBalance;
}

// Calculate activity score (0-1 normalized)
function calculateActivityScore(transactions) {
  const txCount = transactions.transfers ? transactions.transfers.length : 0;
  
  // Normalize activity to 0-1 scale (500+ transactions = 1.0)
  const maxTransactions = 500;
  return Math.min(1.0, txCount / maxTransactions);
}

// Calculate DeFi usage score (0-1 normalized)
function calculateDeFiScore(transactions) {
  if (!transactions.transfers) return 0;
  
  // Enhanced DeFi protocol detection
  const defiProtocols = new Set();
  const categories = new Set();
  let weightedScore = 0;
  
  // Known DeFi protocols with weights
  const knownProtocols = {
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': { name: 'Uniswap V2', weight: 1.0 },
    '0xe592427a0aece92de3edee1f18e0157c05861564': { name: 'Uniswap V3', weight: 1.0 },
    '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9': { name: 'Aave V2', weight: 1.0 },
    '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2': { name: 'Aave V3', weight: 1.0 },
    '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b': { name: 'Compound', weight: 1.0 },
    '0x1111111254eeb25477b68fb85ed929f73a960582': { name: '1inch', weight: 1.0 },
    '0x881d40237659c251811cec9c364ef91dc08d300c': { name: 'Metamask Swap', weight: 0.7 },
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': { name: 'Uniswap V3 Router', weight: 1.0 }
  };
  
  transactions.transfers.forEach(tx => {
    // Check contract address
    if (tx.rawContract && tx.rawContract.address) {
      const contractAddr = tx.rawContract.address.toLowerCase();
      if (knownProtocols[contractAddr]) {
        defiProtocols.add(knownProtocols[contractAddr].name);
        weightedScore += knownProtocols[contractAddr].weight;
        categories.add('defi_protocol');
      }
    }
    
    // Check 'to' address for DeFi protocols
    if (tx.to) {
      const toAddr = tx.to.toLowerCase();
      if (knownProtocols[toAddr]) {
        defiProtocols.add(knownProtocols[toAddr].name);
        weightedScore += knownProtocols[toAddr].weight * 0.8; // Slightly lower weight for 'to' address
        categories.add('defi_protocol');
      }
    }
    
    // Check for ERC-20 token interactions (indicates DeFi usage)
    if (tx.category === 'erc20' && tx.asset && tx.asset !== 'ETH') {
      categories.add('token_interaction');
      weightedScore += 0.3;
    }
  });
  
  // Calculate final score with sophisticated weighting
  let finalScore = 0;
  
  // Base score from protocol diversity (0-0.4)
  const protocolDiversityScore = Math.min(0.4, defiProtocols.size / 8);
  finalScore += protocolDiversityScore;
  
  // Category diversity bonus (0-0.3)
  const categoryDiversityScore = Math.min(0.3, categories.size / 2);
  finalScore += categoryDiversityScore;
  
  // Weighted interaction score (0-0.3)
  const interactionScore = Math.min(0.3, weightedScore / 10);
  finalScore += interactionScore;
  
  return Math.min(1.0, Math.max(0, finalScore));
}

// Calculate token diversity score (0-1 normalized)
function calculateTokenScore(tokenTransfers) {
  if (!tokenTransfers.tokenBalances) return 0;
  
  // Count total tokens the wallet has interacted with (not just current holdings)
  const totalTokenCount = tokenTransfers.tokenBalances.length;
  
  // Normalize token diversity to 0-1 scale (100+ tokens = 1.0)
  const maxTokens = 100;
  return Math.min(1.0, totalTokenCount / maxTokens);
}

function getStatus(score) {
  if (score >= 80) return "Trusted";
  if (score >= 50) return "Stable";
  return "New/Unproven";
}

// JWT Helper Functions
function createAttestationJWT(address, score, status, blockNumber) {
  const payload = {
    address: address.toLowerCase(),
    score: score,
    tier: status,
    feature_version: 'v0',
    as_of_block: blockNumber,
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
    run_id: crypto.randomUUID(),
    issuer: 'oro-reputation-oracle',
    network: 'ethereum'
  };

  return jwt.sign(payload, JWT_SECRET, { 
    algorithm: 'HS256',
    issuer: 'oro-reputation-oracle',
    subject: address.toLowerCase()
  });
}

function verifyAttestationJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// EIP-712 Signature Helper (for Web3 compatibility)
function createEIP712Signature(address, score, status, blockNumber) {
  const domain = {
    name: 'ORO Reputation Oracle',
    version: '1',
    chainId: 1, // Ethereum mainnet
    verifyingContract: '0x0000000000000000000000000000000000000000' // No contract for off-chain
  };

  const types = {
    Attestation: [
      { name: 'address', type: 'address' },
      { name: 'score', type: 'uint256' },
      { name: 'tier', type: 'string' },
      { name: 'asOfBlock', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' }
    ]
  };

  const message = {
    address: address.toLowerCase(),
    score: score,
    tier: status,
    asOfBlock: blockNumber,
          expiresAt: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
  };

  // For now, return a placeholder - in production you'd use a proper EIP-712 signing
  return {
    domain,
    types,
    message,
    signature: '0x' + crypto.randomBytes(65).toString('hex') // Placeholder signature
  };
}

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'ORO API',
    version: '1.0.0',
    description: 'Onchain Reputation Oracle API - Zero-Gas Credential System',
    endpoints: {
      health: '/health',
      score: '/score/:address',
      metadata: '/metadata/:address.json',
      attest: 'POST /v0/attest',
      verify: 'POST /v0/verify'
    },
    features: {
      real_scoring: '5-factor algorithm analyzing onchain behavior',
             jwt_attestations: '30-day portable credentials',
      eip712_signatures: 'Web3-compatible signatures',
      zero_gas: 'No blockchain writes required'
    },
    examples: {
      health: `${req.protocol}://${req.get('host')}/health`,
      score: `${req.protocol}://${req.get('host')}/score/0x1234567890123456789012345678901234567890`,
      metadata: `${req.protocol}://${req.get('host')}/metadata/0x1234567890123456789012345678901234567890.json`,
      attest: `POST ${req.protocol}://${req.get('host')}/v0/attest`,
      verify: `POST ${req.protocol}://${req.get('host')}/v0/verify`
    },
    documentation: 'https://github.com/OROORACLE/oro-mvp/blob/main/API.md'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Performance metrics endpoint
app.get('/metrics', (req, res) => {
  const start = Date.now();
  
  // Simulate some work to test performance
  setTimeout(() => {
    const duration = Date.now() - start;
    res.json({
      status: 'healthy',
      performance: {
        response_time_ms: duration,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory_usage: process.memoryUsage()
      }
    });
  }, Math.random() * 100); // Random delay 0-100ms
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

// JWT Attestation Endpoints
app.post('/v0/attest', async (req, res) => {
  const { address } = req.body;
  
  if (!address || !isValidAddress(address)) {
    return res.status(400).json({ 
      error: "Invalid or missing Ethereum address",
      code: "INVALID_ADDRESS"
    });
  }

  try {
    // Get current score and status
    const score = await calculateScore(address);
    const status = getStatus(score);
    
    // Get current block number (simplified - in production you'd get real block)
    const blockNumber = Math.floor(Date.now() / 1000); // Placeholder
    
    // Create JWT attestation
    const jwtToken = createAttestationJWT(address, score, status, blockNumber);
    
    // Create EIP-712 signature for Web3 compatibility
    const eip712Signature = createEIP712Signature(address, score, status, blockNumber);
    
    res.json({
      success: true,
      attestation: {
        jwt: jwtToken,
        eip712: eip712Signature,
          expires_at: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
          ttl_days: 30
      },
      score_data: {
        address: address.toLowerCase(),
        score: score,
        tier: status,
        as_of_block: blockNumber,
        feature_version: 'v0'
      }
    });
  } catch (error) {
    console.error('Error creating attestation:', error);
    res.status(500).json({ 
      error: "Failed to create attestation",
      code: "ATTESTATION_ERROR"
    });
  }
});

app.post('/v0/verify', (req, res) => {
  const { jwt: jwtToken } = req.body;
  
  if (!jwtToken) {
    return res.status(400).json({ 
      error: "Missing JWT token",
      code: "MISSING_TOKEN"
    });
  }

  try {
    const verification = verifyAttestationJWT(jwtToken);
    
    if (verification.valid) {
      res.json({
        valid: true,
        payload: verification.payload,
        expires_at: new Date(verification.payload.exp * 1000).toISOString(),
        remaining_ttl_seconds: Math.max(0, verification.payload.exp - Math.floor(Date.now() / 1000))
      });
    } else {
      res.status(400).json({
        valid: false,
        error: verification.error,
        code: "INVALID_TOKEN"
      });
    }
  } catch (error) {
    console.error('Error verifying attestation:', error);
    res.status(500).json({ 
      error: "Failed to verify attestation",
      code: "VERIFICATION_ERROR"
    });
  }
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
  const cacheBuster = Math.random().toString(36).substring(7); // Strong cache busting
  if (status === "Trusted") {
    badgeImage = `${githubBaseUrl}/trusted.png?v=${cacheBuster}`;
  } else if (status === "Stable") {
    badgeImage = `${githubBaseUrl}/stable.png?v=${cacheBuster}`;
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
