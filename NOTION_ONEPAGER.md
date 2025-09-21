# ORO — Onchain Reputation Oracle

## 🎯 What is ORO?

ORO is building the infrastructure for Web3 reputation. We analyze onchain behavior patterns to create portable reputation scores that help DeFi protocols make better risk decisions and reward trusted users.

**The Problem:** DeFi protocols lack reliable reputation data, leading to:
- Higher risk and fraud
- Poor user experience
- Fragmented reputation across protocols

**The Solution:** ORO provides:
- Dynamic reputation scores (0-100) for any wallet
- Soulbound badges that update in real-time
- Simple API for easy protocol integration

---

## 🚀 Live Demo

**Try it now:**
- **Frontend:** [https://web-ashen-two.vercel.app/](https://web-ashen-two.vercel.app/)
- **API:** [https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/](https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/)

**Testnet Contract:** `0x7fd112d62e3D32bD3667c878dfAf582B18d4266b` (Sepolia)

---

## 📊 How It Works

### 1. Score Generation
- **Real onchain analysis** of wallet behavior patterns
- **Weighted scoring algorithm** (0-100) based on:
  - Wallet Age (20%) - Time since first transaction
  - ETH Balance (25%) - Current balance with diminishing returns
  - Transaction Activity (20%) - Frequency and patterns
  - DeFi Usage (25%) - Protocol interactions
  - Token Diversity (10%) - Portfolio variety
- **Updates in real-time** as behavior changes

### 2. Badge Minting
- Soulbound ERC-721 tokens (non-transferable)
- One badge per wallet
- Metadata points to live API

### 3. Protocol Integration
- Simple REST API
- Real-time score lookup
- Easy integration with existing contracts

---

## 🛠️ API Endpoints

### Get Wallet Score
```bash
curl "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/score/0x1234..."
```

**Response:**
```json
{
  "address": "0x1234...",
  "score": 85,
  "status": "Trusted",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

### Get Badge Metadata
```bash
curl "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/metadata/0x1234....json"
```

**Response:**
```json
{
  "name": "ORO Badge - Trusted",
  "description": "Reputation badge for 0x1234... Score: 85/100",
  "image": "https://...",
  "attributes": [
    { "trait_type": "Score", "value": 85 },
    { "trait_type": "Status", "value": "Trusted" }
  ]
}
```

---

## 🏆 Reputation Tiers

| Score | Status | Description |
|-------|--------|-------------|
| 80-100 | Trusted | Highest reputation tier |
| 50-79 | Stable | Standard reputation tier |
| 0-49 | New/Unproven | Basic reputation tier |

---

## 💼 Use Cases

### DeFi Protocols
- **Risk Assessment:** Gate high-value transactions based on reputation
- **Reward Programs:** Give better rates to trusted users
- **Fraud Prevention:** Identify suspicious wallet patterns

### Lending Platforms
- **Credit Scoring:** Determine loan terms based on reputation
- **Collateral Requirements:** Reduce collateral for trusted users
- **Default Prevention:** Early warning system for risky borrowers

### NFT Marketplaces
- **Seller Verification:** Highlight trusted sellers
- **Buyer Protection:** Warn about risky buyers
- **Community Building:** Reward active, honest participants

---

## 🎯 Testnet Badge

**Mint your testnet badge:**
1. Visit [https://web-ashen-two.vercel.app/](https://web-ashen-two.vercel.app/)
2. Connect your wallet
3. Click "Mint/Update Badge"
4. Your soulbound reputation badge is minted on Sepolia!

---

## 📈 Roadmap

### Q1 2025
- ✅ MVP deployed on testnet
- ✅ API and frontend live
- 🔄 Partner integrations
- 🔄 Mainnet deployment

### Q2 2025
- Advanced scoring algorithms
- Multi-chain support
- Protocol partnerships
- Enterprise features

---

## 🤝 Partnership Opportunities

We're looking for:
- **DeFi Protocols** to integrate reputation scoring
- **Lending Platforms** for credit assessment
- **NFT Marketplaces** for user verification
- **Web3 Games** for player reputation

**Benefits for Partners:**
- Reduced fraud and risk
- Better user experience
- Competitive advantage
- Early access to new features

---

## 📞 Contact

**Email:** ororep23@gmail.com  
**Twitter:** [@Orooracle](https://x.com/Orooracle)  
**GitHub:** [OROORACLE/oro-mvp](https://github.com/OROORACLE/oro-mvp)  
**Demo:** [https://web-ashen-two.vercel.app/](https://web-ashen-two.vercel.app/)

---

*Ready to integrate ORO into your protocol? Let's talk!*
