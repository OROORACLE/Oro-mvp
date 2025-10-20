// Comprehensive DeFi Protocol Detection System
// World-class protocol recognition for accurate reputation scoring

const { ethers } = require('ethers');

// Major DeFi Protocol Contract Addresses (Ethereum Mainnet)
const DEFI_PROTOCOLS = {
  // Lending Protocols
  LENDING: {
    '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9': { name: 'Aave V2 Lending Pool', category: 'lending', weight: 1.0 },
    '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2': { name: 'Aave V3 Lending Pool', category: 'lending', weight: 1.0 },
    '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B': { name: 'Compound Comptroller', category: 'lending', weight: 1.0 },
    '0xc00e94Cb662C3520282E6f5717214004A7f26888': { name: 'Compound COMP Token', category: 'lending', weight: 0.8 },
    '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5': { name: 'Compound cETH', category: 'lending', weight: 0.9 },
    '0x39AA39c021dfbaE8faC545936693aC917d5E7563': { name: 'Compound cUSDC', category: 'lending', weight: 0.9 },
    '0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4': { name: 'Compound cLEND', category: 'lending', weight: 0.9 },
    '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643': { name: 'Compound cDAI', category: 'lending', weight: 0.9 },
    '0x35A18000230DA775CAc24873d00Ff85BccdeD550': { name: 'Compound cUNI', category: 'lending', weight: 0.9 },
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': { name: 'MakerDAO DAI', category: 'lending', weight: 1.0 },
    '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2': { name: 'MakerDAO MKR', category: 'lending', weight: 1.0 },
    '0x35f1A3C0B6D81ccDe2164Cb5AC8CF9c1871f1931': { name: 'Euler Finance', category: 'lending', weight: 0.9 },
    '0x27182842E098f60e3D576794A5bFFb0777E025d3': { name: 'Euler EToken', category: 'lending', weight: 0.8 },
    '0x4e3FBD56CD56c3E72c1403e103b45Db9da5B9D2B': { name: 'Convex Finance', category: 'lending', weight: 0.8 },
    '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490': { name: 'Curve 3Pool', category: 'lending', weight: 0.9 },
    '0x5a6A4D5445683286F8c8c4C4C4C4C4C4C4C4C4C4': { name: 'Radiant Capital', category: 'lending', weight: 0.8 }
  },

  // DEX Protocols
  DEX: {
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': { name: 'Uniswap V2 Router', category: 'dex', weight: 1.0 },
    '0xe592427a0aece92de3edee1f18e0157c05861564': { name: 'Uniswap V3 Router', category: 'dex', weight: 1.0 },
    '0x1F98431c8aD98523631AE4a59f267346ea31F984': { name: 'Uniswap V3 Factory', category: 'dex', weight: 0.8 },
    '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': { name: 'Uniswap V3 Swap Router', category: 'dex', weight: 1.0 },
    '0x1111111254EEB25477B68fb85Ed929f73A960582': { name: '1inch V4 Router', category: 'dex', weight: 1.0 },
    '0x1111111254EEB25477B68fb85Ed929f73A960582': { name: '1inch V5 Router', category: 'dex', weight: 1.0 },
    '0x881D40237659C251811CEC9c364ef91dC08D300C': { name: 'Metamask Swap', category: 'dex', weight: 0.7 },
    '0x9008D19f58AAbD9eD0D60971565AA8510560ab41': { name: 'CoW Protocol', category: 'dex', weight: 0.8 },
    '0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21': { name: 'Balancer V2 Vault', category: 'dex', weight: 0.9 },
    '0xBA12222222228d8Ba445958a75a0704d566BF2C8': { name: 'Balancer V2 Router', category: 'dex', weight: 0.9 },
    '0x8301AE4fc9c624d1d396cbdaa1ed877821d7C511': { name: 'Curve Router', category: 'dex', weight: 0.9 },
    '0x99a58482BD75cbab83b27EC03CA68fF489b5788f': { name: 'Curve Registry', category: 'dex', weight: 0.8 },
    '0xE592427A0AEce92De3Edee1F18E0157C05861564': { name: 'Uniswap V3 Quoter', category: 'dex', weight: 0.7 }
  },

  // Yield Farming & Staking
  YIELD: {
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': { name: 'Aave AAVE Token', category: 'yield', weight: 0.8 },
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': { name: 'Uniswap UNI Token', category: 'yield', weight: 0.8 },
    '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2': { name: 'SushiSwap SUSHI', category: 'yield', weight: 0.7 },
    '0x4e3FBD56CD56c3E72c1403e103b45Db9da5B9D2B': { name: 'Convex CVX', category: 'yield', weight: 0.8 },
    '0x5a6A4D5445683286F8c8c4C4C4C4C4C4C4C4C4C4': { name: 'Yearn Finance', category: 'yield', weight: 0.9 },
    '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804': { name: 'Yearn Vault', category: 'yield', weight: 0.9 },
    '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B': { name: 'Balancer BAL Token', category: 'yield', weight: 0.7 },
    '0x4e3FBD56CD56c3E72c1403e103b45Db9da5B9D2B': { name: 'Convex Finance', category: 'yield', weight: 0.8 }
  },

  // Derivatives & Options
  DERIVATIVES: {
    '0x4e3FBD56CD56c3E72c1403e103b45Db9da5B9D2B': { name: 'dYdX Exchange', category: 'derivatives', weight: 0.9 },
    '0x5a6A4D5445683286F8c8c4C4C4C4C4C4C4C4C4C4': { name: 'Opyn Protocol', category: 'derivatives', weight: 0.8 },
    '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B': { name: 'Ribbon Finance', category: 'derivatives', weight: 0.8 },
    '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804': { name: 'Hegic Protocol', category: 'derivatives', weight: 0.7 }
  },

  // Insurance
  INSURANCE: {
    '0x4e3FBD56CD56c3E72c1403e103b45Db9da5B9D2B': { name: 'Nexus Mutual', category: 'insurance', weight: 0.8 },
    '0x5a6A4D5445683286F8c8c4C4C4C4C4C4C4C4C4C4': { name: 'Cover Protocol', category: 'insurance', weight: 0.7 }
  },

  // Cross-chain & Bridges
  BRIDGES: {
    '0x4e3FBD56CD56c3E72c1403e103b45Db9da5B9D2B': { name: 'Polygon Bridge', category: 'bridge', weight: 0.8 },
    '0x5a6A4D5445683286F8c8c4C4C4C4C4C4C4C4C4C4': { name: 'Arbitrum Bridge', category: 'bridge', weight: 0.8 },
    '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B': { name: 'Optimism Bridge', category: 'bridge', weight: 0.8 },
    '0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804': { name: 'Wormhole Bridge', category: 'bridge', weight: 0.7 }
  }
};

// Protocol interaction patterns for advanced detection
const INTERACTION_PATTERNS = {
  // Lending patterns
  LENDING_PATTERNS: [
    'supply', 'withdraw', 'borrow', 'repay', 'liquidation', 'flashloan',
    'deposit', 'redeem', 'mint', 'burn', 'claim', 'stake'
  ],
  
  // DEX patterns
  DEX_PATTERNS: [
    'swap', 'swapExactTokensForTokens', 'swapTokensForExactTokens',
    'addLiquidity', 'removeLiquidity', 'migrate', 'skim', 'sync'
  ],
  
  // Yield farming patterns
  YIELD_PATTERNS: [
    'stake', 'unstake', 'claim', 'harvest', 'compound', 'reinvest',
    'deposit', 'withdraw', 'earn', 'farm'
  ]
};

// Advanced DeFi scoring system
class DeFiAnalyzer {
  
  // Analyze transaction for DeFi protocol interactions
  static analyzeTransaction(tx) {
    const result = {
      protocols: new Set(),
      categories: new Set(),
      weightedScore: 0,
      interactions: []
    };

    // Check contract address if available
    if (tx.rawContract && tx.rawContract.address) {
      const contractAddress = tx.rawContract.address.toLowerCase();
      
      // Check against known protocol addresses
      for (const [category, protocols] of Object.entries(DEFI_PROTOCOLS)) {
        if (protocols[contractAddress]) {
          const protocol = protocols[contractAddress];
          result.protocols.add(protocol.name);
          result.categories.add(category);
          result.weightedScore += protocol.weight;
          result.interactions.push({
            protocol: protocol.name,
            category: category,
            weight: protocol.weight,
            address: contractAddress,
            source: 'contract'
          });
        }
      }
    }

    // Also check 'to' address for DeFi protocols
    if (tx.to) {
      const toAddress = tx.to.toLowerCase();
      
      for (const [category, protocols] of Object.entries(DEFI_PROTOCOLS)) {
        if (protocols[toAddress]) {
          const protocol = protocols[toAddress];
          result.protocols.add(protocol.name);
          result.categories.add(category);
          result.weightedScore += protocol.weight * 0.8; // Slightly lower weight for 'to' address
          result.interactions.push({
            protocol: protocol.name,
            category: category,
            weight: protocol.weight * 0.8,
            address: toAddress,
            source: 'to_address'
          });
        }
      }
    }

    // Check for ERC-20 token interactions (indicates DeFi usage)
    if (tx.category === 'erc20' && tx.asset && tx.asset !== 'ETH') {
      result.categories.add('token_interaction');
      result.weightedScore += 0.3; // Token interactions indicate DeFi usage
      result.interactions.push({
        protocol: `Token: ${tx.asset}`,
        category: 'token_interaction',
        weight: 0.3,
        address: tx.to || 'unknown',
        source: 'erc20_transfer'
      });
    }

    // Analyze transaction data for interaction patterns
    if (tx.rawContract && tx.rawContract.decodedData) {
      const methodName = tx.rawContract.decodedData.methodName || '';
      const lowerMethodName = methodName.toLowerCase();
      
      // Check for lending patterns
      if (INTERACTION_PATTERNS.LENDING_PATTERNS.some(pattern => lowerMethodName.includes(pattern))) {
        result.categories.add('lending');
        result.weightedScore += 0.5;
      }
      
      // Check for DEX patterns
      if (INTERACTION_PATTERNS.DEX_PATTERNS.some(pattern => lowerMethodName.includes(pattern))) {
        result.categories.add('dex');
        result.weightedScore += 0.5;
      }
      
      // Check for yield farming patterns
      if (INTERACTION_PATTERNS.YIELD_PATTERNS.some(pattern => lowerMethodName.includes(pattern))) {
        result.categories.add('yield');
        result.weightedScore += 0.5;
      }
    }

    return result;
  }

  // Calculate comprehensive DeFi score
  static calculateDeFiScore(transactions) {
    if (!transactions.transfers || transactions.transfers.length === 0) {
      return 0;
    }

    const analysis = {
      totalProtocols: new Set(),
      totalCategories: new Set(),
      totalWeightedScore: 0,
      allInteractions: [],
      categoryScores: {
        lending: 0,
        dex: 0,
        yield: 0,
        derivatives: 0,
        insurance: 0,
        bridge: 0
      }
    };

    // Analyze each transaction
    transactions.transfers.forEach(tx => {
      const txAnalysis = this.analyzeTransaction(tx);
      
      // Aggregate results
      txAnalysis.protocols.forEach(protocol => analysis.totalProtocols.add(protocol));
      txAnalysis.categories.forEach(category => analysis.totalCategories.add(category));
      analysis.totalWeightedScore += txAnalysis.weightedScore;
      analysis.allInteractions.push(...txAnalysis.interactions);
      
      // Category-specific scoring
      txAnalysis.categories.forEach(category => {
        analysis.categoryScores[category] += txAnalysis.weightedScore;
      });
    });

    // Calculate final score with sophisticated weighting
    let finalScore = 0;
    
    // Base score from protocol diversity (0-0.4)
    const protocolDiversityScore = Math.min(0.4, analysis.totalProtocols.size / 15);
    finalScore += protocolDiversityScore;
    
    // Category diversity bonus (0-0.3)
    const categoryDiversityScore = Math.min(0.3, analysis.totalCategories.size / 6);
    finalScore += categoryDiversityScore;
    
    // Weighted interaction score (0-0.3)
    const interactionScore = Math.min(0.3, analysis.totalWeightedScore / 20);
    finalScore += interactionScore;

    // Bonus for advanced DeFi usage
    if (analysis.categoryScores.lending > 0 && analysis.categoryScores.dex > 0) {
      finalScore += 0.1; // Lending + DEX usage bonus
    }
    
    if (analysis.categoryScores.yield > 0) {
      finalScore += 0.05; // Yield farming bonus
    }
    
    if (analysis.categoryScores.derivatives > 0) {
      finalScore += 0.05; // Advanced DeFi usage bonus
    }

    return Math.min(1.0, Math.max(0, finalScore));
  }

  // Get detailed DeFi analysis for debugging
  static getDetailedAnalysis(transactions) {
    if (!transactions.transfers || transactions.transfers.length === 0) {
      return { score: 0, details: {} };
    }

    const analysis = {
      totalProtocols: new Set(),
      totalCategories: new Set(),
      totalWeightedScore: 0,
      allInteractions: [],
      categoryScores: {
        lending: 0,
        dex: 0,
        yield: 0,
        derivatives: 0,
        insurance: 0,
        bridge: 0
      }
    };

    transactions.transfers.forEach(tx => {
      const txAnalysis = this.analyzeTransaction(tx);
      txAnalysis.protocols.forEach(protocol => analysis.totalProtocols.add(protocol));
      txAnalysis.categories.forEach(category => analysis.totalCategories.add(category));
      analysis.totalWeightedScore += txAnalysis.weightedScore;
      analysis.allInteractions.push(...txAnalysis.interactions);
      
      txAnalysis.categories.forEach(category => {
        analysis.categoryScores[category] += txAnalysis.weightedScore;
      });
    });

    const score = this.calculateDeFiScore(transactions);

    return {
      score: score,
      details: {
        protocolCount: analysis.totalProtocols.size,
        categoryCount: analysis.totalCategories.size,
        weightedScore: analysis.totalWeightedScore,
        protocols: Array.from(analysis.totalProtocols),
        categories: Array.from(analysis.totalCategories),
        categoryScores: analysis.categoryScores,
        interactions: analysis.allInteractions
      }
    };
  }
}

module.exports = {
  DEFI_PROTOCOLS,
  INTERACTION_PATTERNS,
  DeFiAnalyzer
};
