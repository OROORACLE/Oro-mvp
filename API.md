# ORO API Documentation

## Base URL
```
https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app
```

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
curl "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/score/0x1234567890123456789012345678901234567890"

# Get metadata
curl "https://orooracle-mqenn88nd-loganstafford740-1721s-projects.vercel.app/metadata/0x1234567890123456789012345678901234567890.json"
```

## Rate Limits
- No rate limits currently enforced
- Please use responsibly

## Support
- Email: ororep23@gmail.com
- Twitter: [@Orooracle](https://x.com/Orooracle)
- GitHub: [OROORACLE/oro-mvp](https://github.com/OROORACLE/oro-mvp)
