// Simple script to test mass wallets
const testWallets = [
  '0x1e12b042201a20f7295c0e9b490dc35754961937', // The one we tested
  '0x50DE1986Cf5bEFe0C8ee74D6Df6dfFe842dc2632', // Another real wallet
  '0x1234567890123456789012345678901234567890', // Test wallet
  '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', // Test wallet
  '0x9876543210987654321098765432109876543210'  // Test wallet
];

const API_URL = 'https://oro-api-private.onrender.com';

async function testWallet(address) {
  try {
    console.log(`Testing wallet: ${address}`);
    const start = Date.now();
    
    const response = await fetch(`${API_URL}/score/${address}`);
    const data = await response.json();
    
    const duration = Date.now() - start;
    console.log(`✅ ${address}: Score ${data.score} (${data.status}) - ${duration}ms`);
    
    return { address, score: data.score, status: data.status, duration };
  } catch (error) {
    console.error(`❌ ${address}: Error - ${error.message}`);
    return { address, error: error.message };
  }
}

async function testAllWallets() {
  console.log('🚀 Starting mass wallet test...');
  console.log(`Testing ${testWallets.length} wallets against: ${API_URL}`);
  console.log('---');
  
  const results = [];
  
  for (const wallet of testWallets) {
    const result = await testWallet(wallet);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('---');
  console.log('📊 Test Results:');
  console.log(`Total wallets tested: ${results.length}`);
  console.log(`Successful: ${results.filter(r => r.score !== undefined).length}`);
  console.log(`Failed: ${results.filter(r => r.error).length}`);
  
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
  
  console.log(`Average response time: ${Math.round(avgDuration)}ms`);
  
  // Test caching by running the same wallets again
  console.log('\n🔄 Testing cache performance...');
  const cachedResults = [];
  
  for (const wallet of testWallets) {
    const result = await testWallet(wallet);
    cachedResults.push(result);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const avgCachedDuration = cachedResults
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / cachedResults.filter(r => r.duration).length;
  
  console.log(`Average cached response time: ${Math.round(avgCachedDuration)}ms`);
  console.log(`Cache speedup: ${Math.round(avgDuration / avgCachedDuration)}x faster`);
}

// Run the test
testAllWallets().catch(console.error);
