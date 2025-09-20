# ORO — Onchain Reputation Oracle 🛡️

**ORO** is a reputation oracle for Web3.  
It scores wallets based on onchain behavior and makes that reputation portable across protocols.  

## ✨ What It Does
- Scores wallets dynamically (0–100) based on activity
- Issues **soulbound badges** that update in real time
- Provides a simple API (`/score/:wallet`) so protocols can integrate reputation directly
- Helps DeFi protocols reduce risk, reward trusted users, and gate features more intelligently

## 🚧 Current Status
- MVP in progress  
- Testnet demo launching soon  
- Seeking 1–2 design partners to validate integration

## 🔗 Quick Links
- [Twitter/X](https://x.com/Orooracle)  
- [Notion One-Pager](#) _(coming soon)_  
- [Pitch Deck](#) _(coming soon)_  

## 🛠 For Developers
### Score API (planned)
```http
GET /score/:wallet
Response: { "address": "0x123...", "score": 72, "updatedAt": "2025-09-20T00:00:00Z" }
