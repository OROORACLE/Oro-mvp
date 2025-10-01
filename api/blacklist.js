// Known bad actor wallet addresses
// These wallets should always get minimum scores regardless of onchain activity

const BLACKLISTED_ADDRESSES = new Set([
  // Major Hackers/Exploiters
  '0x098B716B8Aaf21512996dC57EB0615e2383E2f96', // Ronin Bridge Hacker
  '0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963', // Poly Network Hacker
  '0x0d043128146654C7683Fbf30ac98D7B2285DeD00', // Harmony Bridge Hacker
  '0x1A5cd1e32a2C2c8e0963a99C6Bd8c5C3B3E8B5B1', // Nomad Bridge Hacker
  
  // Known Scammers/Rug Pulls
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Exit Scam 1
  '0x1e12b042201a20f7295c0e9b490dc35754961937', // Rug Pull 1
  
  // Sanctioned Addresses
  '0x12D66f87A04A9E220743712Ce6d9bB1Ba5616C8a', // Tornado Cash 1
  '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3cB293', // Tornado Cash 2
  
  // Known Spam/Attack Wallets
  '0x0000000000000000000000000000000000000003', // Spam Wallet 1
  '0x0000000000000000000000000000000000000004', // Attack Wallet 1
]);

// Check if an address is blacklisted
function isBlacklisted(address) {
  return BLACKLISTED_ADDRESSES.has(address.toLowerCase());
}

// Get blacklist reason (for logging/debugging)
function getBlacklistReason(address) {
  const addr = address.toLowerCase();
  
  const reasons = {
    '0x098B716B8Aaf21512996dC57EB0615e2383E2f96': 'Ronin Bridge Hacker ($600M+)',
    '0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963': 'Poly Network Hacker ($600M+)',
    '0x0d043128146654C7683Fbf30ac98D7B2285DeD00': 'Harmony Bridge Hacker ($100M+)',
    '0x1A5cd1e32a2C2c8e0963a99C6Bd8c5C3B3E8B5B1': 'Nomad Bridge Hacker ($190M+)',
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6': 'Known Exit Scam',
    '0x1e12b042201a20f7295c0e9b490dc35754961937': 'Known Rug Pull',
    '0x12D66f87A04A9E220743712Ce6d9bB1Ba5616C8a': 'Tornado Cash (Sanctioned)',
    '0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3cB293': 'Tornado Cash (Sanctioned)',
    '0x0000000000000000000000000000000000000003': 'Known Spam Wallet',
    '0x0000000000000000000000000000000000000004': 'Known Attack Wallet',
  };
  
  return reasons[addr] || 'Blacklisted Address';
}

module.exports = {
  isBlacklisted,
  getBlacklistReason,
  BLACKLISTED_ADDRESSES
};
