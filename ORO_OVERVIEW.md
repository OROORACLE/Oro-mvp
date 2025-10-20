# ORO - Onchain Reputation Oracle 🚀

## **🎯 What is ORO?**

ORO is an onchain reputation system that analyzes wallet behavior patterns to generate dynamic reputation scores (0-100) for any Ethereum address. Our system is optimized for DeFi use cases and provides real-time reputation data through a simple API.

## **🧠 How ORO Works**

### **Scoring Algorithm**
ORO uses real onchain data analysis with DeFi-optimized weights:

- **40% Activity** - Transaction count and patterns (most important in DeFi)
- **25% DeFi Usage** - Protocol interactions (key indicator)
- **15% Wallet Age** - Time since first transaction (less critical in fast-moving DeFi)
- **15% Token Diversity** - Number of different tokens held (important for DeFi users)
- **5% Balance** - Current ETH balance (least important in DeFi)

### **Risk Analysis**
- **Advanced fraud detection** using transaction pattern analysis
- **OFAC compliance** with sanctioned address detection
- **Bot detection** through behavioral pattern analysis
- **Real-time updates** as wallet behavior changes

## **🛠️ API Integration**

### **Basic Usage**
```javascript
// Get wallet reputation score
const response = await fetch(`https://orooracle.com/score/${walletAddress}`);
const data = await response.json();

console.log(`Score: ${data.score}/100`);
console.log(`Tier: ${data.tier}`); // Trusted, Stable, or New/Unproven
```

### **Response Format**
```json
{
  "score": 85,
  "tier": "Trusted",
  "status": "Trusted",
  "updatedAt": "2025-01-20T10:30:00Z",
  "riskFlags": [],
  "riskLevel": "LOW",
  "metadata": {
    "transactionCount": 150,
    "tokenCount": 8,
    "balanceEth": 2.5,
    "riskLevel": "LOW",
    "riskScore": 0,
    "riskFactors": []
  }
}
```

## **🎯 Use Cases**

### **DeFi Protocols**
- **Lending platforms** - Assess borrower risk
- **DEXs** - Identify trusted traders
- **Yield farming** - Reward long-term users
- **Insurance** - Price coverage based on reputation

### **Web3 Applications**
- **Gaming** - Identify legitimate players
- **NFT marketplaces** - Prevent wash trading
- **Social protocols** - Build trust networks
- **DAO governance** - Weight voting power

## **📊 Supported DeFi Protocols**

- **Uniswap V2/V3** - DEX trading
- **Aave** - Lending/borrowing
- **Compound** - Lending protocols
- **1inch** - DEX aggregator
- **Yearn Finance** - Yield farming
- **Curve Finance** - Stablecoin swaps

## **🔒 Security & Privacy**

- **No personal data collection** - Only onchain behavior analysis
- **Real-time scoring** - Updates as behavior changes
- **Comprehensive risk detection** - Advanced fraud prevention
- **API reliability** - High uptime and performance

## **🚀 Getting Started**

1. **Try the API** - Test with any Ethereum address
2. **Integrate** - Simple REST API with clear documentation
3. **Customize** - Partner-specific scoring weights available
4. **Scale** - Enterprise-grade infrastructure

---

**Ready to build with onchain reputation? Check out our [API documentation](API.md) to get started! 🚀**
