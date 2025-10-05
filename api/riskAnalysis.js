// Advanced Risk Analysis for Onchain Bad Actor Detection
// Analyzes transaction patterns, DeFi interactions, and network behavior

const { ethers } = require('ethers');

// Known suspicious contract addresses
const SUSPICIOUS_CONTRACTS = new Set([
  // Mixers/Privacy tools
  '0x12D66f87A04A9E220743712Ce6d9bB1Ba5616C8a', // Tornado Cash
  '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3cB293', // Tornado Cash
  '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',  // Tornado Cash
  '0xA160cdAB225685dA1d56aa342Ad8841c3b53f291',  // Tornado Cash
  
  // Known scam contracts (add more as discovered)
  '0x0000000000000000000000000000000000000000', // Null address
  
  // Additional suspicious patterns
  '0x000000000000000000000000000000000000dead', // Dead address
  '0x0000000000000000000000000000000000000001', // Common test address
]);

// Known scam token patterns
const SCAM_TOKEN_PATTERNS = [
  /^0x[a-fA-F0-9]{40}$/, // All hex addresses (potential scam tokens)
];

// Suspicious transaction patterns
const SUSPICIOUS_PATTERNS = {
  // Rapid fire transactions (potential bot behavior)
  RAPID_FIRE: 5, // transactions within 10 blocks
  
  // Large round number transfers (potential test/scam funds)
  ROUND_TRANSFERS: 10, // ETH
  
  // High gas price patterns (potential MEV/front-running)
  HIGH_GAS_THRESHOLD: 100000000000, // 100 gwei
};

// Known DeFi protocols that should not be flagged for normal protocol behavior
const KNOWN_DEFI_PROTOCOLS = new Set([
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // Uniswap V2 Router
  '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap V3 Router
  '0x28c6c06298d514db089934071355e5743bf21d60', // Binance Hot Wallet
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be', // Binance Hot Wallet
  '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503', // Binance Hot Wallet
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // Vitalik's wallet
  '0xab5801a7d398351b8be11c439e05c5b3259aec9b'  // Vitalik's old wallet
]);

// OFAC Sanctioned Addresses (Tornado Cash and related)
const OFAC_SANCTIONED_ADDRESSES = new Set([
  '0x8589427373d6d84e98730d7795d8f6f8731fda16',
  '0x722122df12d4e14e13ac3b6895a86e84145b6967',
  '0xdd4c48c0b24039969fc16d1cdf626eab821d3384',
  '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
  '0xd96f2b1c14db8458374d9aca76e26c3d18364307',
  '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc',
  '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf'
]);

// Risk analysis functions
class RiskAnalyzer {
  
  // Analyze transaction patterns for suspicious behavior
  static analyzeTransactionPatterns(transactions, address = null) {
    const riskFactors = [];
    let riskScore = 0;
    
    // Check for address pattern analysis first (potential vanity/scam addresses)
    if (address) {
      const addressPattern = this.analyzeAddressPattern(address);
      if (addressPattern.isSuspicious) {
        riskFactors.push(`Suspicious address pattern: ${addressPattern.reason}`);
        riskScore += addressPattern.riskScore;
      }
      
      // Check for OFAC sanctioned addresses
      if (OFAC_SANCTIONED_ADDRESSES.has(address.toLowerCase())) {
        riskFactors.push('OFAC Sanctioned Address - Tornado Cash mixer');
        riskScore += 100; // Maximum risk score
      }
    }
    
    if (!transactions.transfers || transactions.transfers.length === 0) {
      if (riskFactors.length === 0) {
        riskFactors.push('No transaction history');
      }
      return { riskScore: Math.min(riskScore, 100), riskFactors };
    }
    
    const transfers = transactions.transfers;
    
    // 1. Check for large sudden balance changes
    const largeTransfers = transfers.filter(tx => {
      try {
        const value = parseFloat(ethers.formatEther(tx.value || '0'));
        return value > 100; // More than 100 ETH in single transaction
      } catch (error) {
        // Skip transactions with invalid values
        return false;
      }
    });
    
    if (largeTransfers.length > 0) {
      riskFactors.push(`Large transfers detected: ${largeTransfers.length} transactions > 100 ETH`);
      riskScore += 30;
    }
    
    // 2. Check for rapid token movements (potential laundering) - MUCH MORE CONSERVATIVE
    const tokenTransfers = transfers.filter(tx => tx.category === 'erc20');
    if (tokenTransfers.length > 2000 && !KNOWN_DEFI_PROTOCOLS.has(address?.toLowerCase())) {
      riskFactors.push(`High token activity: ${tokenTransfers.length} token transfers`);
      riskScore += 20;
    }
    
    // 3. Check for interaction with suspicious contracts
    const suspiciousInteractions = transfers.filter(tx => 
      tx.rawContract && SUSPICIOUS_CONTRACTS.has(tx.rawContract.address)
    );
    
    if (suspiciousInteractions.length > 0) {
      riskFactors.push(`Suspicious contract interactions: ${suspiciousInteractions.length}`);
      riskScore += 50; // High risk
    }
    
    // 4. Check for bot-like patterns (MUCH MORE CONSERVATIVE - only flag extreme cases)
    if (transfers.length >= 100 && !KNOWN_DEFI_PROTOCOLS.has(address?.toLowerCase())) {
      // Look for patterns that indicate bot behavior - ONLY EXTREME CASES
      let botScore = 0;
      let botReasons = [];
      
      // Pattern 1: EXTREMELY high transaction frequency (less than 0.1 blocks between txs)
      const recentTransfers = transfers.slice(0, 100); // Last 100 transactions
      if (recentTransfers.length >= 50) {
        const timestamps = recentTransfers.map(tx => tx.blockNum).filter(Boolean);
        if (timestamps.length >= 20) {
          const timeSpan = timestamps[0] - timestamps[timestamps.length - 1];
          const avgTimeBetweenTx = timeSpan / timestamps.length;
          
          // Only flag if average time is less than 0.1 blocks (1.2 seconds) - EXTREME
          if (avgTimeBetweenTx < 0.1) {
            botScore += 15;
            botReasons.push('Extremely high transaction frequency');
          }
        }
      }
      
      // Pattern 2: EXTREMELY consistent transaction amounts (95%+ same amounts)
      const amounts = recentTransfers.map(tx => {
        try {
          return parseFloat(ethers.formatEther(tx.value || '0'));
        } catch (error) {
          return 0;
        }
      }).filter(amount => amount > 0);
      
      if (amounts.length >= 20) {
        const uniqueAmounts = new Set(amounts.map(a => Math.round(a * 100) / 100)); // Round to 2 decimals
        const consistencyRatio = uniqueAmounts.size / amounts.length;
        
        // Only flag if more than 95% of transactions use the same amounts - EXTREME
        if (consistencyRatio < 0.05) {
          botScore += 10;
          botReasons.push('Highly consistent transaction amounts');
        }
      }
      
      // Pattern 3: EXTREME rapid-fire transactions (20+ transactions in same block)
      const blockGroups = {};
      recentTransfers.forEach(tx => {
        if (tx.blockNum) {
          blockGroups[tx.blockNum] = (blockGroups[tx.blockNum] || 0) + 1;
        }
      });
      
      const maxTxPerBlock = Math.max(...Object.values(blockGroups));
      if (maxTxPerBlock >= 20) { // Much higher threshold
        botScore += 20;
        botReasons.push(`Multiple transactions per block (${maxTxPerBlock} max)`);
      }
      
      // Only flag as bot if ALL patterns are detected AND score is very high
      if (botScore >= 40 && botReasons.length >= 2) {
        riskFactors.push(`Automated/bot-like patterns: ${botReasons.join(', ')}`);
        riskScore += 25;
      }
    }
    
    // 5. Check for round number transfers (potential test/scam funds)
    const roundTransfers = transfers.filter(tx => {
      try {
        const value = parseFloat(ethers.formatEther(tx.value || '0'));
        return value > 0 && (value % 1 === 0 || value % 0.1 === 0); // Round numbers
      } catch (error) {
        // Skip transactions with invalid values
        return false;
      }
    });
    if (roundTransfers.length > 3) {
      riskFactors.push(`Round number transfers detected: ${roundTransfers.length} transactions`);
      riskScore += 15;
    }
    
    // 6. Check for high gas price patterns (potential MEV/front-running)
    const highGasTransfers = transfers.filter(tx => {
      return tx.gasPrice && parseFloat(tx.gasPrice) > SUSPICIOUS_PATTERNS.HIGH_GAS_THRESHOLD;
    });
    if (highGasTransfers.length > 2) {
      riskFactors.push(`High gas price patterns detected: ${highGasTransfers.length} transactions`);
      riskScore += 20;
    }
    
    // 7. Address pattern analysis moved to beginning of function
    
    return { riskScore: Math.min(riskScore, 100), riskFactors };
  }
  
  // Analyze DeFi interactions for abuse patterns
  static analyzeDeFiPatterns(transactions) {
    const riskFactors = [];
    let riskScore = 0;
    
    if (!transactions.transfers) return { riskScore: 0, riskFactors: [] };
    
    const transfers = transactions.transfers;
    
    // 1. Check for flash loan patterns (borrow and repay in same block)
    const flashLoanPatterns = this.detectFlashLoanPatterns(transfers);
    if (flashLoanPatterns.length > 0) {
      riskFactors.push(`Flash loan patterns detected: ${flashLoanPatterns.length}`);
      riskScore += 40;
    }
    
    // 2. Check for liquidation avoidance patterns
    const liquidationPatterns = this.detectLiquidationPatterns(transfers);
    if (liquidationPatterns.length > 0) {
      riskFactors.push(`Liquidation avoidance patterns detected: ${liquidationPatterns.length}`);
      riskScore += 30;
    }
    
    // 3. Check for MEV/front-running patterns
    const mevPatterns = this.detectMEVPatterns(transfers);
    if (mevPatterns.length > 0) {
      riskFactors.push(`MEV/front-running patterns detected: ${mevPatterns.length}`);
      riskScore += 35;
    }
    
    return { riskScore: Math.min(riskScore, 100), riskFactors };
  }
  
  // Detect flash loan patterns
  static detectFlashLoanPatterns(transfers) {
    // This is a simplified detection - in production you'd analyze more complex patterns
    const flashLoanContracts = new Set([
      '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9', // Aave
      '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5', // Compound
    ]);
    
    return transfers.filter(tx => 
      tx.rawContract && flashLoanContracts.has(tx.rawContract.address)
    );
  }
  
  // Detect liquidation avoidance patterns
  static detectLiquidationPatterns(transfers) {
    // Look for patterns where someone adds collateral right before liquidation
    // This is simplified - real detection would be more complex
    return [];
  }
  
  // Detect MEV/front-running patterns
  static detectMEVPatterns(transfers) {
    // Look for high gas fees and rapid transactions
    return transfers.filter(tx => {
      // Simplified MEV detection based on gas price
      return tx.gasPrice && parseFloat(tx.gasPrice) > 100000000000; // 100 gwei
    });
  }
  
  // Analyze balance patterns for suspicious behavior
  static analyzeBalancePatterns(balance, transactions) {
    const riskFactors = [];
    let riskScore = 0;
    
    let ethBalance = 0;
    try {
      ethBalance = parseFloat(ethers.formatEther(balance._hex || balance));
    } catch (error) {
      console.log('Error parsing balance, using 0:', error.message);
      ethBalance = 0;
    }
    
    // 1. Check for unusually high balance with low activity
    if (ethBalance > 1000 && transactions.transfers && transactions.transfers.length < 10) {
      riskFactors.push('High balance with low activity (potential stolen funds)');
      riskScore += 40;
    }
    
    // 2. Check for balance that's too round (potential test/faucet funds)
    if (ethBalance > 0 && ethBalance % 1 === 0) {
      riskFactors.push('Round balance amount (potential test funds)');
      riskScore += 10;
    }
    
    return { riskScore: Math.min(riskScore, 100), riskFactors };
  }
  
  // Analyze address patterns for suspicious characteristics (MUCH MORE CONSERVATIVE)
  static analyzeAddressPattern(address) {
    const cleanAddr = address.toLowerCase().replace('0x', '');
    let riskScore = 0;
    let reason = '';
    let isSuspicious = false;
    
    // 1. Check for EXTREME repeating characters (6+ in a row) - only flag obvious patterns
    const extremeRepeatingPattern = /(.)\1{5,}/.test(cleanAddr);
    if (extremeRepeatingPattern) {
      riskScore += 20;
      reason = 'Extreme repeating character pattern detected';
      isSuspicious = true;
    }
    
    // 2. Check for EXTREME sequential patterns (6+ characters in sequence)
    const extremeSequentialPattern = /012345|123456|234567|345678|456789|56789a|6789ab|789abc|89abcd|9abcde|abcdef|bcdef0|cdef01|def012|ef0123|f01234/.test(cleanAddr);
    if (extremeSequentialPattern) {
      riskScore += 25;
      reason = 'Extreme sequential character pattern detected';
      isSuspicious = true;
    }
    
    // 3. Check for all zeros (potential test addresses) - keep this strict
    if (cleanAddr === '0000000000000000000000000000000000000000') {
      riskScore += 30;
      reason = 'All zeros pattern detected';
      isSuspicious = true;
    }
    
    // 3b. Check for all ones - but be more lenient (vanity addresses are legitimate)
    if (cleanAddr === '1111111111111111111111111111111111111111') {
      riskScore += 10; // Lower penalty for vanity addresses
      reason = 'All ones pattern detected (vanity address)';
      isSuspicious = true;
    }
    
    // 4. Check for common test patterns - keep this strict
    const testPatterns = ['dead', 'beef', 'cafe', 'babe', 'face'];
    const hasTestPattern = testPatterns.some(pattern => cleanAddr.includes(pattern));
    if (hasTestPattern) {
      riskScore += 25; // Higher penalty for test patterns
      reason = 'Common test pattern detected';
      isSuspicious = true;
    }
    
    // 5. Check for EXTREME repeating 2-character patterns (5+ repetitions)
    const extremeRepeatingTwoChar = /(..)\1{4,}/.test(cleanAddr);
    if (extremeRepeatingTwoChar) {
      riskScore += 25;
      reason = 'Extreme repeating 2-character pattern detected';
      isSuspicious = true;
    }
    
    return { isSuspicious, riskScore, reason };
  }
  
  // Main risk analysis function
  static analyzeWalletRisk(address, balance, transactions, tokenTransfers) {
    const results = {
      totalRiskScore: 0,
      riskFactors: [],
      riskFlags: [],
      riskLevel: 'LOW'
    };
    
    // Analyze different risk factors
    const txPatterns = this.analyzeTransactionPatterns(transactions, address);
    const defiPatterns = this.analyzeDeFiPatterns(transactions);
    const balancePatterns = this.analyzeBalancePatterns(balance, transactions);
    
    // Combine risk scores
    results.totalRiskScore = Math.max(
      txPatterns.riskScore,
      defiPatterns.riskScore,
      balancePatterns.riskScore
    );
    
    // Combine risk factors
    results.riskFactors = [
      ...txPatterns.riskFactors,
      ...defiPatterns.riskFactors,
      ...balancePatterns.riskFactors
    ];
    
    // Convert risk factors to structured flags
    results.riskFlags = this.convertFactorsToFlags(results.riskFactors);
    
    // Determine risk level
    if (results.totalRiskScore >= 70) {
      results.riskLevel = 'HIGH';
    } else if (results.totalRiskScore >= 40) {
      results.riskLevel = 'MEDIUM';
    } else {
      results.riskLevel = 'LOW';
    }
    
    return results;
  }
  
  // Convert risk factors to structured flag objects
  static convertFactorsToFlags(riskFactors) {
    const flags = [];
    
    riskFactors.forEach(factor => {
      let flag = {
        type: 'MEDIUM',
        category: 'GENERAL',
        message: factor,
        severity: 'WARNING'
      };
      
      // Categorize flags by severity and type
      if (factor.includes('Tornado Cash') || factor.includes('Suspicious contract')) {
        flag.type = 'HIGH';
        flag.category = 'PRIVACY_MIXER';
        flag.severity = 'CRITICAL';
      } else if (factor.includes('Flash loan') || factor.includes('MEV') || factor.includes('front-running')) {
        flag.type = 'HIGH';
        flag.category = 'DEFI_ABUSE';
        flag.severity = 'CRITICAL';
      } else if (factor.includes('Large transfers') || factor.includes('High gas price')) {
        flag.type = 'MEDIUM';
        flag.category = 'TRANSACTION_PATTERN';
        flag.severity = 'WARNING';
      } else if (factor.includes('Automated') || factor.includes('bot-like')) {
        flag.type = 'MEDIUM';
        flag.category = 'BEHAVIOR_PATTERN';
        flag.severity = 'WARNING';
      } else if (factor.includes('Round number') || factor.includes('test funds')) {
        flag.type = 'LOW';
        flag.category = 'SUSPICIOUS_PATTERN';
        flag.severity = 'INFO';
      } else if (factor.includes('Limited transaction history') || factor.includes('No transaction history')) {
        flag.type = 'LOW';
        flag.category = 'ACTIVITY_LEVEL';
        flag.severity = 'INFO';
      } else if (factor.includes('Suspicious address pattern')) {
        flag.type = 'MEDIUM';
        flag.category = 'ADDRESS_PATTERN';
        flag.severity = 'WARNING';
      } else if (factor.includes('High balance') || factor.includes('Round balance')) {
        flag.type = 'MEDIUM';
        flag.category = 'BALANCE_PATTERN';
        flag.severity = 'WARNING';
      } else if (factor.includes('High token activity')) {
        flag.type = 'MEDIUM';
        flag.category = 'TOKEN_ACTIVITY';
        flag.severity = 'WARNING';
            } else if (factor.includes('Liquidation avoidance')) {
              flag.type = 'HIGH';
              flag.category = 'DEFI_ABUSE';
              flag.severity = 'CRITICAL';
            } else if (factor.includes('OFAC Sanctioned')) {
              flag.type = 'HIGH';
              flag.category = 'SANCTIONS';
              flag.severity = 'CRITICAL';
            }
      
      flags.push(flag);
    });
    
    return flags;
  }
}

module.exports = { RiskAnalyzer };
