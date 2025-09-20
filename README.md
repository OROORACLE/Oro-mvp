# ORO — Onchain Reputation Oracle 🛡️

**ORO** is a reputation oracle for Web3.  
It scores wallets based on onchain behavior and makes that reputation portable across protocols.  

---

## What It Does
- Dynamic reputation score (0–100) for any wallet  
- Soulbound badges that update in real time  
- Simple API (`/score/:wallet`) for protocol integrations  
- Helps DeFi protocols reduce risk, reward trusted users, and gate features more intelligently  

---

## Current Status
- MVP in progress  
- Testnet demo launching soon  
- Seeking 1–2 design partners to validate integration  

---

## Quick Links
- [Twitter](https://x.com/Orooracle)  
- Notion One-Pager _(coming soon)_  
- Pitch Deck _(coming soon)_  

---

## Developer Preview
### Score API (planned)
```http
GET /score/:wallet
Response:
{
  "address": "0x123...",
  "score": 72,
  "updatedAt": "2025-09-20T00:00:00Z"
}
```

---

## License
MIT License © 2025 OROORACLE
