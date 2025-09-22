# ORO API - Private Repository 🔒

**This repository contains the proprietary scoring algorithm and API endpoints for ORO (Onchain Reputation Oracle).**

## ⚠️ PRIVATE REPOSITORY
This repository is **PRIVATE** and contains:
- Proprietary scoring algorithm
- API endpoints (`/score/:address`, `/v0/attest`, `/v0/verify`)
- Performance monitoring
- JWT attestation logic

## 🚀 Deployment

### Railway (Recommended)
```bash
railway login
railway init
railway up
```

### Render
```bash
# Deploy via Render dashboard
# Connect this repository
```

### Environment Variables
```bash
ALCHEMY_API_KEY=your_alchemy_key
JWT_SECRET=your_jwt_secret
ORO_PRIVATE_KEY=your_private_key
```

## 📡 API Endpoints

- `GET /score/:address` - Get wallet reputation score
- `POST /v0/attest` - Create JWT attestation
- `POST /v0/verify` - Verify JWT attestation
- `GET /metrics` - Performance metrics

## 🔐 Security
- Keep this repository private
- Never commit API keys or secrets
- Use environment variables for all sensitive data

## 📞 Contact
For access or questions, contact: ororep23@gmail.com