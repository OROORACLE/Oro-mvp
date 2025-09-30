# ORO API Documentation

## Base URL
```
https://orooracle-h15unb47o-loganstafford740-1721s-projects.vercel.app
```

## 🚀 New: Zero-Gas JWT Attestations

ORO now supports **zero-gas credential attestations** for seamless partner integration:

- **30-day portable credentials** - partners can cache and reuse
- **JWT + EIP-712 signatures** - Web3 compatible
- **No blockchain writes** - instant verification
- **API-first monetization** - charge per attestation

## 🧠 Scoring Algorithm

ORO uses real onchain data analysis to generate reputation scores (0-100):

| Factor | Weight | Description |
|--------|--------|-------------|
| **Transaction Activity** | 40% | Transaction count and patterns (most important in DeFi) |
| **DeFi Usage** | 25% | Protocol interactions (Uniswap, Aave, Compound, etc.) |
| **Wallet Age** | 15% | Time since first transaction (less critical in fast-moving DeFi) |
| **Token Diversity** | 15% | Number of different tokens held (important for DeFi users) |
| **ETH Balance** | 5% | Current balance with diminishing returns (least important in DeFi) |

**Data Source:** Ethereum Mainnet via Alchemy API

### Supported DeFi Protocols
- **Uniswap V2/V3** - DEX trading
- **Aave** - Lending/borrowing
- **Compound** - Lending protocols
- **1inch** - DEX aggregator
- **Metamask Swap** - Built-in swapping

### Technical Details
- **API Response Time:** ~2-3 seconds for full analysis
- **Data Freshness:** Real-time (latest block)
- **Fallback:** Deterministic scoring if API unavailable
- **Rate Limits:** No current limits (use responsibly)

## Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### Get Wallet Score
```http
GET /score/:address
```

**Parameters:**
- `address` (string, required): Ethereum wallet address (0x format)

**Response:**
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "score": 56,
  "status": "Good Standing",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

**Status Tiers:**
- `Never Defaulted`: Score 80-100
- `Good Standing`: Score 50-79  
- `New/Unproven`: Score 0-49

### Get Badge Metadata
```http
GET /metadata/:address.json
```

**Parameters:**
- `address` (string, required): Ethereum wallet address (0x format)

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

## Error Responses

### Invalid Address
```json
{
  "error": "Invalid Ethereum address"
}
```

## Integration Examples

### JavaScript/TypeScript
```javascript
const API_BASE = 'https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app';

// Get wallet score
async function getWalletScore(address) {
  const response = await fetch(`${API_BASE}/score/${address}`);
  return await response.json();
}

// Get badge metadata
async function getBadgeMetadata(address) {
  const response = await fetch(`${API_BASE}/metadata/${address}.json`);
  return await response.json();
}
```

### Python
```python
import requests

API_BASE = 'https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app'

def get_wallet_score(address):
    response = requests.get(f'{API_BASE}/score/{address}')
    return response.json()

def get_badge_metadata(address):
    response = requests.get(f'{API_BASE}/metadata/{address}.json')
    return response.json()
```

### cURL
```bash
# Get score
curl "https://orooracle-h15unb47o-loganstafford740-1721s-projects.vercel.app/score/0x1234567890123456789012345678901234567890"

# Get metadata
curl "https://orooracle-h15unb47o-loganstafford740-1721s-projects.vercel.app/metadata/0x1234567890123456789012345678901234567890.json"

# Create JWT attestation (NEW)
curl -X POST "https://orooracle-h15unb47o-loganstafford740-1721s-projects.vercel.app/v0/attest" \
  -H "Content-Type: application/json" \
  -d '{"address": "0x1234567890123456789012345678901234567890"}'

# Verify JWT attestation (NEW)
curl -X POST "https://orooracle-h15unb47o-loganstafford740-1721s-projects.vercel.app/v0/verify" \
  -H "Content-Type: application/json" \
  -d '{"jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

## Rate Limits
- No rate limits currently enforced
- Please use responsibly

## Support
- Email: ororep23@gmail.com
- Twitter: [@Orooracle](https://x.com/Orooracle)
- GitHub: [OROORACLE/oro-mvp](https://github.com/OROORACLE/oro-mvp)
