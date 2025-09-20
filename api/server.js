const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper functions
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function calculateScore(address) {
  const cleanAddress = address.toLowerCase().replace('0x', '');
  const lastByte = cleanAddress.slice(-2);
  const score = parseInt(lastByte, 16);
  return Math.floor((score / 255) * 100);
}

function getStatus(score) {
  if (score >= 80) return "Never Defaulted";
  if (score >= 50) return "Good Standing";
  return "New/Unproven";
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/score/:address', (req, res) => {
  const { address } = req.params;
  
  if (!isValidAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }

  const score = calculateScore(address);
  const status = getStatus(score);
  
  res.json({
    address: address.toLowerCase(),
    score: score,
    status: status,
    updatedAt: new Date().toISOString()
  });
});

app.get('/metadata/:address.json', (req, res) => {
  const { address } = req.params;
  
  if (!isValidAddress(address)) {
    return res.status(400).json({ error: "Invalid Ethereum address" });
  }

  const score = calculateScore(address);
  const status = getStatus(score);
  
  const metadata = {
    name: `ORO Badge - ${status}`,
    description: `Reputation badge for ${address}. Score: ${score}/100`,
    image: `https://via.placeholder.com/512x512/000000/ffffff?text=ORO+${score}`,
    attributes: [
      { trait_type: "Score", value: score },
      { trait_type: "Status", value: status }
    ]
  };

  res.json(metadata);
});

app.listen(PORT, () => {
  console.log(`🚀 ORO API running on http://localhost:${PORT}`);
  console.log(`📊 Score: http://localhost:${PORT}/score/:address`);
  console.log(`🖼️  Metadata: http://localhost:${PORT}/metadata/:address.json`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
});

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
