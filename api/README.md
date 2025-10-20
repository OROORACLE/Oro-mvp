# ORO API

Onchain Reputation Oracle API server.

## Local Development

```bash
npm install
npm start
```

## Deployment

### Railway
1. Connect your GitHub repo to Railway
2. Select the `api` folder
3. Railway will auto-detect Node.js and deploy

### Render
1. Connect your GitHub repo to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)

## API Endpoints

- `GET /health` - Health check
- `GET /score/:address` - Get reputation score
- `GET /metadata/:address.json` - Get badge metadata
