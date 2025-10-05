const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create wallets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        address VARCHAR(42) PRIMARY KEY,
        score INTEGER NOT NULL,
        tier VARCHAR(20) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        transaction_count INTEGER DEFAULT 0,
        token_count INTEGER DEFAULT 0,
        balance_eth DECIMAL(20, 8) DEFAULT 0,
        risk_flags JSONB DEFAULT '[]',
        risk_level VARCHAR(10) DEFAULT 'LOW'
      )
    `);
    
    // Add risk flags columns if they don't exist (for existing databases)
    await pool.query(`
      ALTER TABLE wallets 
      ADD COLUMN IF NOT EXISTS risk_flags JSONB DEFAULT '[]'
    `);
    
    await pool.query(`
      ALTER TABLE wallets 
      ADD COLUMN IF NOT EXISTS risk_level VARCHAR(10) DEFAULT 'LOW'
    `);

    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_wallets_last_updated 
      ON wallets(last_updated)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Get wallet score from database
async function getWalletScore(address) {
  try {
    const result = await pool.query(
      'SELECT * FROM wallets WHERE address = $1',
      [address.toLowerCase()]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting wallet score:', error);
    return null;
  }
}

// Save wallet score to database
async function saveWalletScore(address, score, tier, metadata = {}) {
  try {
    const { transactionCount = 0, tokenCount = 0, balanceEth = 0, riskFlags = [], riskLevel = 'LOW' } = metadata;
    
    await pool.query(`
      INSERT INTO wallets (address, score, tier, transaction_count, token_count, balance_eth, risk_flags, risk_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (address) 
      DO UPDATE SET 
        score = EXCLUDED.score,
        tier = EXCLUDED.tier,
        last_updated = CURRENT_TIMESTAMP,
        transaction_count = EXCLUDED.transaction_count,
        token_count = EXCLUDED.token_count,
        balance_eth = EXCLUDED.balance_eth,
        risk_flags = EXCLUDED.risk_flags,
        risk_level = EXCLUDED.risk_level
    `, [address.toLowerCase(), score, tier, Math.round(transactionCount), Math.round(tokenCount), balanceEth, JSON.stringify(riskFlags), riskLevel]);
    
    console.log(`Saved wallet score for ${address}: ${score} (${tier}) with ${riskFlags.length} risk flags`);
  } catch (error) {
    console.error('Error saving wallet score:', error);
    throw error;
  }
}

// Get all wallets that need updating (older than 6 hours)
async function getWalletsForUpdate() {
  try {
    const result = await pool.query(`
      SELECT address FROM wallets 
      WHERE last_updated < NOW() - INTERVAL '6 hours'
      ORDER BY last_updated ASC
      LIMIT 100
    `);
    return result.rows.map(row => row.address);
  } catch (error) {
    console.error('Error getting wallets for update:', error);
    return [];
  }
}

// Get all watched wallets
async function getAllWatchedWallets() {
  try {
    const result = await pool.query(`
      SELECT address FROM wallets 
      ORDER BY last_updated ASC
    `);
    return result.rows.map(row => row.address);
  } catch (error) {
    console.error('Error getting all watched wallets:', error);
    return [];
  }
}

// Get database stats
async function getDatabaseStats() {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_wallets,
        COUNT(CASE WHEN last_updated > NOW() - INTERVAL '6 hours' THEN 1 END) as recently_updated,
        AVG(score) as avg_score
      FROM wallets
    `);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting database stats:', error);
    return { total_wallets: 0, recently_updated: 0, avg_score: 0 };
  }
}

module.exports = {
  pool,
  initializeDatabase,
  getWalletScore,
  saveWalletScore,
  getWalletsForUpdate,
  getAllWatchedWallets,
  getDatabaseStats
};
