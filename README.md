# ORO — Onchain Reputation Oracle 🛡️

**ORO** is a reputation oracle for Web3.  
It scores wallets based on onchain behavior and makes that reputation portable across protocols.  

---

## 🚀 Live Demo

- **Frontend:** [https://web-ashen-two.vercel.app/](https://web-ashen-two.vercel.app/)
- **API:** [https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/](https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/)
- **Contract:** `0x7fd112d62e3D32bD3667c878dfAf582B18d4266b` (Sepolia)

---

## What It Does
- Dynamic reputation score (0–100) for any wallet  
- Soulbound badges that update in real time  
- Simple API for protocol integrations  
- Helps DeFi protocols reduce risk, reward trusted users, and gate features more intelligently  

---

## 🛠️ Quick Start

### 1. Get Wallet Score
```bash
curl "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/score/0x1234567890123456789012345678901234567890"
```

**Response:**
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "score": 56,
  "status": "Good Standing",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

### 2. Get Badge Metadata
```bash
curl "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/metadata/0x1234567890123456789012345678901234567890.json"
```

**Response:**
```json
{
  "name": "ORO Badge - Good Standing",
  "description": "Reputation badge for 0x1234567890123456789012345678901234567890. Score: 56/100",
  "image": "https://via.placeholder.com/512x512/000000/ffffff?text=ORO+56",
  "attributes": [
    { "trait_type": "Score", "value": 56 },
    { "trait_type": "Status", "value": "Good Standing" }
  ]
}
```

### 3. Mint Badge (Web3)
1. Visit [https://web-ashen-two.vercel.app/](https://web-ashen-two.vercel.app/)
2. Connect your wallet
3. Click "Mint/Update Badge"
4. Your soulbound reputation badge is minted on Sepolia!

---

## 📊 Reputation Tiers

| Score Range | Status | Description |
|-------------|--------|-------------|
| 80-100 | Never Defaulted | Highest reputation tier |
| 50-79 | Good Standing | Standard reputation tier |
| 0-49 | New/Unproven | Basic reputation tier |

---

## 🔗 Quick Links
- [Live Demo](https://web-ashen-two.vercel.app/)
- [API Documentation](https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/)
- [Twitter](https://x.com/Orooracle)
- [Notion One-Pager](https://www.notion.so/oro-reputation-oracle) _(coming soon)_
- [Pitch Deck](https://docs.google.com/presentation/d/oro-pitch) _(coming soon)_

---

## License
MIT License © 2025 OROORACLE
