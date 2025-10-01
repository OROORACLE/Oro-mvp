const { Alchemy, Network } = require('alchemy-sdk');
const { ethers } = require('ethers');
const { isBlacklisted, getBlacklistReason } = require('./blacklist');
const { RiskAnalyzer } = require('./riskAnalysis');
const { DeFiAnalyzer } = require('./defiProtocols');

// Initialize Alchemy
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY || 'eqHZ7IU0G8noXjF-OLo6U',
  network: Network.ETH_MAINNET,
  maxRetries: 3,
  requestTimeout: 30000
});

// Address validation function
function isValidEthereumAddress(address) {
  // Basic Ethereum address validation
  if (!address || typeof address !== 'string') return false;
  if (!address.startsWith('0x')) return false;
  if (address.length !== 42) return false;
  
  // Only reject the zero address (0x000...000) as it's truly invalid
  const cleanAddress = address.toLowerCase();
  if (cleanAddress === '0x0000000000000000000000000000000000000000') return false;
  
  // Check if it's a valid hex string
  const hexPart = cleanAddress.slice(2);
  if (!/^[0-9a-f]+$/.test(hexPart)) return false;
  
  return true;
}

// Main scoring function
async function calculateScore(address) {
  // Validate address first
  if (!isValidEthereumAddress(address)) {
    console.log(`Invalid address detected: ${address}, returning minimum score`);
    return {
      score: 0,
      tier: 'New/Unproven',
      status: 'New/Unproven',
      updatedAt: new Date().toISOString(),
      metadata: {
        transactionCount: 0,
        tokenCount: 0,
        balanceEth: 0
      }
    };
  }
  
  // Check blacklist first - CRITICAL for security
  if (isBlacklisted(address)) {
    const reason = getBlacklistReason(address);
    console.log(`BLACKLISTED ADDRESS DETECTED: ${address} - ${reason}`);
    return {
      score: 0,
      tier: 'New/Unproven',
      status: 'New/Unproven',
      updatedAt: new Date().toISOString(),
      metadata: {
        transactionCount: 0,
        tokenCount: 0,
        balanceEth: 0,
        blacklisted: true,
        blacklistReason: reason
      }
    };
  }
  
  try {
    console.log(`Analyzing wallet: ${address}`);
    
    // Set up timeout for the entire scoring process
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Scoring timeout')), 25000); // 25 second timeout
    });
    
    const scoringPromise = (async () => {
      // Fetch all data in parallel
      const [balance, transactions, tokenTransfers] = await Promise.all([
        alchemy.core.getBalance(address),
        alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
          maxCount: 1000
        }),
        alchemy.core.getTokenBalances(address)
      ]);

      // Perform advanced risk analysis FIRST
      const riskAnalysis = RiskAnalyzer.analyzeWalletRisk(address, balance, transactions, tokenTransfers);
      
      // If high risk detected, return low score immediately
      if (riskAnalysis.riskLevel === 'HIGH') {
        console.log(`HIGH RISK WALLET DETECTED: ${address} - ${riskAnalysis.riskFactors.join(', ')}`);
        return {
          score: Math.max(0, 20 - riskAnalysis.totalRiskScore), // Cap at 20 for high risk
          tier: 'New/Unproven',
          status: 'New/Unproven',
          updatedAt: new Date().toISOString(),
          riskFlags: riskAnalysis.riskFlags || [],
          riskLevel: riskAnalysis.riskLevel || 'HIGH',
          metadata: {
            transactionCount: transactions.transfers ? transactions.transfers.length : 0,
            tokenCount: tokenTransfers.tokenBalances ? tokenTransfers.tokenBalances.length : 0,
            balanceEth: parseFloat(ethers.formatEther(balance._hex || balance)),
            riskLevel: riskAnalysis.riskLevel,
            riskScore: riskAnalysis.totalRiskScore,
            riskFactors: riskAnalysis.riskFactors
          }
        };
      }
      
      // Calculate individual scores (0-1 normalized)
      const walletAge = await calculateWalletAge(address, transactions);
      const balanceScore = calculateBalanceScore(balance);
      const activityScore = calculateActivityScore(transactions);
      const defiScore = DeFiAnalyzer.calculateDeFiScore(transactions);
      const tokenScore = calculateTokenScore(tokenTransfers);

      // Apply weights and calculate total score (DeFi-optimized)
      let totalScore = Math.round(
        (activityScore * 0.40 +  // 40% - Activity is most important in DeFi
         defiScore * 0.25 +      // 25% - DeFi usage is key indicator
         walletAge * 0.15 +      // 15% - Age less critical in fast-moving DeFi
         tokenScore * 0.15 +     // 15% - Token diversity matters for DeFi users
         balanceScore * 0.05) * 100 // 5% - Balance least important in DeFi
      );
      
      // Apply risk penalty for medium risk wallets (reduced penalties for normal users)
      if (riskAnalysis.riskLevel === 'MEDIUM') {
        const riskPenalty = Math.min(30, riskAnalysis.totalRiskScore * 0.5); // Reduced from 50 to 30, 0.8 to 0.5
        totalScore = Math.max(0, totalScore - riskPenalty);
        console.log(`MEDIUM RISK WALLET: ${address} - Applied ${riskPenalty} point penalty`);
      }
      
      // Apply penalty for high risk wallets (reduced for normal users)
      if (riskAnalysis.riskLevel === 'HIGH') {
        const riskPenalty = Math.min(50, riskAnalysis.totalRiskScore * 0.7); // Reduced from 70 to 50, 1.0 to 0.7
        totalScore = Math.max(0, totalScore - riskPenalty);
        console.log(`HIGH RISK WALLET: ${address} - Applied ${riskPenalty} point penalty`);
      }
      
      // Safety check: ensure score is within valid range
      const finalScore = Math.max(0, Math.min(100, totalScore));

      // Determine tier (raised thresholds for better security)
      let tier;
      if (finalScore >= 75) tier = 'Trusted';    // Raised from 70 for better security
      else if (finalScore >= 50) tier = 'Stable'; // Raised from 40 to catch more bad wallets
      else tier = 'New/Unproven';

      // Get detailed DeFi analysis for logging
      const defiAnalysis = DeFiAnalyzer.getDetailedAnalysis(transactions);
      
      console.log(`Score breakdown for ${address}:`, {
        normalized: {
          walletAge: Math.round(walletAge * 100) / 100,
          balanceScore: Math.round(balanceScore * 100) / 100,
          activityScore: Math.round(activityScore * 100) / 100,
          defiScore: Math.round(defiScore * 100) / 100,
          tokenScore: Math.round(tokenScore * 100) / 100
        },
        weighted: {
          walletAge: Math.round(walletAge * 0.15 * 100),
          balanceScore: Math.round(balanceScore * 0.05 * 100),
          activityScore: Math.round(activityScore * 0.40 * 100),
          defiScore: Math.round(defiScore * 0.25 * 100),
          tokenScore: Math.round(tokenScore * 0.15 * 100)
        },
        totalScore: Math.round(totalScore),
        defiDetails: {
          protocols: defiAnalysis.details.protocols,
          categories: defiAnalysis.details.categories,
          protocolCount: defiAnalysis.details.protocolCount
        }
      });

      // Return score data with metadata
      return {
        score: finalScore,
        tier: tier,
        status: tier, // Add status field for frontend compatibility
        updatedAt: new Date().toISOString(),
        riskFlags: riskAnalysis.riskFlags || [],
        riskLevel: riskAnalysis.riskLevel || 'LOW',
        metadata: {
          transactionCount: transactions.transfers ? transactions.transfers.length : 0,
          tokenCount: tokenTransfers.tokenBalances ? tokenTransfers.tokenBalances.length : 0,
          balanceEth: parseFloat(ethers.formatEther(balance._hex || balance)),
          riskLevel: riskAnalysis.riskLevel,
          riskScore: riskAnalysis.totalRiskScore,
          riskFactors: riskAnalysis.riskFactors
        }
      };
    })();
    
    // Race between scoring and timeout
    return await Promise.race([scoringPromise, timeoutPromise]);
    
  } catch (error) {
    console.error('Error calculating score:', error);
    console.log(`Falling back to deterministic scoring for ${address}`);
    
    // Fallback to conservative deterministic scoring if API fails or times out
    const cleanAddress = address.toLowerCase().replace('0x', '');
    const lastByte = cleanAddress.slice(-2);
    const score = parseInt(lastByte, 16);
    
    // Much more conservative fallback scoring (max 30 points)
    const finalScore = Math.floor((score / 255) * 30); // Max 30 instead of 100
    
    let tier;
    if (finalScore >= 25) tier = 'Stable';     // Conservative: only 25+ for Stable
    else tier = 'New/Unproven';                // Everything else is New/Unproven
    
    return {
      score: finalScore,
      tier: tier,
      status: tier, // Add status field for frontend compatibility
      updatedAt: new Date().toISOString(),
      metadata: {
        transactionCount: 0,
        tokenCount: 0,
        balanceEth: 0
      }
    };
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
  
  // Normalize age to 0-1 scale (6+ months = 1.0)
  const maxAge = 180; // 6 months in days (more realistic for DeFi users)
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
  
  // Normalize balance to 0-1 scale with diminishing returns (10+ ETH = 1.0)
  if (ethBalance < 0.001) return 0; // Lowered threshold
  
  // Use logarithmic scaling for diminishing returns
  const maxBalance = 10; // Lowered from 50 ETH to 10 ETH
  const normalizedBalance = Math.min(1.0, Math.log10(ethBalance + 1) / Math.log10(maxBalance + 1));
  return normalizedBalance;
}

// Calculate activity score (0-1 normalized)
function calculateActivityScore(transactions) {
  const txCount = transactions.transfers ? transactions.transfers.length : 0;
  
  // Normalize activity to 0-1 scale (500+ transactions = 1.0) - More generous
  const maxTx = 500; // Lowered from 1000
  return Math.min(1.0, Math.max(0, txCount / maxTx));
}

// Legacy DeFi score function - now using DeFiAnalyzer.calculateDeFiScore()
// Keeping for backward compatibility but not used in main scoring
function calculateDeFiScore(transactions) {
  return DeFiAnalyzer.calculateDeFiScore(transactions);
}

// Calculate token score (0-1 normalized)
function calculateTokenScore(tokenTransfers) {
  const totalTokenCount = tokenTransfers.tokenBalances ? tokenTransfers.tokenBalances.length : 0;
  
  // Normalize token diversity to 0-1 scale (5+ tokens = 1.0)
  const maxTokens = 5; // Very realistic for normal DeFi users
  return Math.min(1.0, Math.max(0, totalTokenCount / maxTokens));
}

module.exports = {
  calculateScore,
  calculateWalletAge,
  calculateBalanceScore,
  calculateActivityScore,
  calculateDeFiScore,
  calculateTokenScore
};
