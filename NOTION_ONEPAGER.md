# ORO — Onchain Reputation Oracle

## 🎯 What is ORO?

ORO is building the infrastructure for Web3 reputation. We analyze onchain behavior patterns to create portable reputation scores that help DeFi protocols make better risk decisions and reward trusted users.

**The Problem:** DeFi protocols lack reliable reputation data, leading to:
- Higher risk and fraud
- Poor user experience
- Fragmented reputation across protocols

**The Solution:** ORO provides:
- Dynamic reputation scores (0-100) for any wallet
- Zero-gas JWT attestations (30-day portable credentials)
- Simple API for easy protocol integration

---

## 🚀 Live Demo

**Try it now:**
- **API:** [https://oro-api-private.onrender.com/](https://oro-api-private.onrender.com/)
- **API Status:** [https://oro-api-private.onrender.com/status](https://oro-api-private.onrender.com/status)
- **Documentation:** [https://github.com/OROORACLE/oro-mvp/blob/main/API.md](https://github.com/OROORACLE/oro-mvp/blob/main/API.md)

---

## 📊 How It Works

### 1. Score Generation
- **Real onchain analysis** of wallet behavior patterns
- **Multi-factor scoring algorithm** (0-100) analyzing:
  - Transaction patterns and activity levels
  - DeFi protocol interactions and usage
  - Wallet age and historical behavior
  - Token diversity and portfolio composition
  - Balance and financial activity
- **Updates in real-time** as behavior changes

### 2. Risk Analysis & Fraud Detection
- **Advanced pattern recognition** to identify suspicious behavior
- **OFAC compliance** with sanctioned address detection
- **Bot and wash trading detection** through behavioral analysis
- **Multi-layered risk assessment** with real-time flagging
- **Comprehensive risk scoring** for informed decision making

### 3. JWT Attestations
- Zero-gas portable credentials (30-day validity)
- EIP-712 signatures for Web3 compatibility
- Partners can cache and reuse attestations

### 4. Protocol Integration
- Simple REST API
- Real-time score lookup
- Easy integration with existing contracts

---

## 🛠️ API Endpoints

### Get Wallet Score
```bash
curl "https://oro-api-private.onrender.com/score/0x1234..."
```

**Response:**
```json
{
  "address": "0x1234...",
  "score": 85,
  "tier": "Trusted",
  "status": "Trusted",
  "riskLevel": "LOW",
  "riskFlags": [],
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

### Get JWT Attestation
```bash
curl -X POST "https://oro-api-private.onrender.com/v0/attest" \
  -H "Content-Type: application/json" \
  -d '{"address": "0x1234..."}'
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "signature": "0x1234...",
  "expiresAt": "2025-02-19T10:30:00Z"
}
```

---

## 🏆 Reputation Tiers

| Score | Status | Description |
|-------|--------|-------------|
| 75-100 | Trusted | Highest reputation tier |
| 35-74 | Stable | Standard reputation tier |
| 0-34 | New/Unproven | Basic reputation tier |

---

## 💼 Use Cases

### DeFi Protocols
- **Risk Assessment:** Gate high-value transactions based on reputation
- **Reward Programs:** Give better rates to trusted users
- **Fraud Prevention:** Identify suspicious wallet patterns and bad actors
- **Compliance:** Ensure OFAC compliance and regulatory adherence

### Lending Platforms
- **Credit Scoring:** Determine loan terms based on reputation
- **Collateral Requirements:** Reduce collateral for trusted users
- **Default Prevention:** Early warning system for risky borrowers

### NFT Marketplaces
- **Seller Verification:** Highlight trusted sellers
- **Buyer Protection:** Warn about risky buyers
- **Community Building:** Reward active, honest participants

---

## 🎯 Try the API

**Test the reputation system:**
1. Use our API: `GET https://oro-api-private.onrender.com/score/{address}`
2. Get JWT attestation: `POST https://oro-api-private.onrender.com/v0/attest`
3. Check API status: [https://oro-api-private.onrender.com/status](https://oro-api-private.onrender.com/status)
4. Review documentation: [API.md](https://github.com/OROORACLE/oro-mvp/blob/main/API.md)

---

## 📈 Roadmap

### Q4 2025 (Current)
- ✅ Production-ready API deployed
- ✅ JWT attestations implemented
- ✅ High accuracy on real-world testing
- ✅ Enterprise-grade risk analysis
- 🔄 Partner integrations
- 🔄 Advanced monitoring dashboard

### Q1 2026
- Multi-chain support (Polygon, Arbitrum, Base)
- Custom scoring models for enterprise partners
- White-label solutions
- Advanced analytics dashboard

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
**API:** [https://oro-api-private.onrender.com/](https://oro-api-private.onrender.com/)

---

*Ready to integrate ORO into your protocol? Let's talk!*

<!-- Updated: 2025-01-20 - COMPLETELY REWRITTEN -->
