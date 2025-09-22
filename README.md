# ORO — Onchain Reputation Oracle 🛡️

**ORO** is a reputation oracle for Web3.  
It scores wallets based on onchain behavior and makes that reputation portable across protocols.  

---

## 🚀 Live Demo

- **Frontend:** [https://web-kg5efdlfv-loganstafford740-1721s-projects.vercel.app/](https://web-kg5efdlfv-loganstafford740-1721s-projects.vercel.app/)
- **API:** [https://orooracle-2g4w1aeof-loganstafford740-1721s-projects.vercel.app/](https://orooracle-2g4w1aeof-loganstafford740-1721s-projects.vercel.app/)

---

## What It Does
- **Real onchain reputation scoring** (0–100) based on actual wallet behavior
- **Zero-gas JWT attestations** for seamless partner integration
- **Simple API** for protocol integrations  
- **Performance monitoring** with real-time analytics
- **Helps DeFi protocols** reduce risk, reward trusted users, and gate features more intelligently

## 🧠 Scoring Algorithm

ORO analyzes real onchain data to generate reputation scores:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Wallet Age** | 20% | How long the wallet has been active (first transaction date) |
| **ETH Balance** | 25% | Current ETH balance with diminishing returns |
| **Transaction Activity** | 20% | Transaction frequency and volume patterns |
| **DeFi Usage** | 25% | Interactions with major DeFi protocols (Uniswap, Aave, Compound, etc.) |
| **Token Diversity** | 10% | Number of different tokens held |

**Data Sources:** Ethereum Mainnet via Alchemy API  

---

## 🛠️ Quick Start

### 1. Get Wallet Score
```bash
curl "https://orooracle-2g4w1aeof-loganstafford740-1721s-projects.vercel.app/score/0x1234567890123456789012345678901234567890"
```

**Response:**
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "score": 75,
  "status": "Stable",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

### 2. Create JWT Attestation (Zero-Gas)
```bash
curl -X POST "https://orooracle-2g4w1aeof-loganstafford740-1721s-projects.vercel.app/v0/attest" \
  -H "Content-Type: application/json" \
  -d '{"address": "0x1234567890123456789012345678901234567890"}'
```

**Response:**
```json
{
  "success": true,
  "attestation": {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2025-02-20T10:30:00Z",
    "ttl_days": 30
  },
  "score_data": {
    "address": "0x1234567890123456789012345678901234567890",
    "score": 75,
    "tier": "Stable"
  }
}
```

### 3. Verify JWT Attestation
```bash
curl -X POST "https://orooracle-2g4w1aeof-loganstafford740-1721s-projects.vercel.app/v0/verify" \
  -H "Content-Type: application/json" \
  -d '{"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

**Response:**
```json
{
  "valid": true,
  "claims": {
    "sub": "0x1234567890123456789012345678901234567890",
    "tier": "Stable",
    "score": 75,
    "exp": 1737369000
  }
}
```

---

## 📊 Reputation Tiers

| Score Range | Status | Description |
|-------------|--------|-------------|
| 80-100 | Trusted | Highest reputation tier |
| 50-79 | Stable | Standard reputation tier |
| 0-49 | New/Unproven | Basic reputation tier |

---

## 🔗 Quick Links
- [Live Demo](https://web-kg5efdlfv-loganstafford740-1721s-projects.vercel.app/)
- [API Documentation](https://orooracle-2g4w1aeof-loganstafford740-1721s-projects.vercel.app/)
- [Twitter](https://x.com/Orooracle)
- [Notion One-Pager](https://www.notion.so/oro-reputation-oracle) _(coming soon)_
- [Pitch Deck](https://docs.google.com/presentation/d/oro-pitch) _(coming soon)_

---

## License
MIT License © 2025 OROORACLE
