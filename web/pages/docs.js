import Head from 'next/head';

export default function Docs() {
  return (
    <>
      <Head>
        <title>ORO Documentation - Onchain Reputation Oracle</title>
        <meta name="description" content="Complete documentation for ORO - the onchain reputation oracle for Web3" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                🛡️ ORO
              </div>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Documentation</span>
            </div>
            <a href="/" style={{
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              transition: 'background 0.3s ease'
            }}>
              ← Back to Demo
            </a>
          </div>
        </header>

        {/* Main Content */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            ORO Documentation
          </h1>
          
          <p style={{
            fontSize: '18px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Complete guide to the Onchain Reputation Oracle
          </p>

          {/* Table of Contents */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '40px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Table of Contents</h3>
            <ul style={{ color: '#666', lineHeight: '1.8' }}>
              <li><a href="#overview" style={{ color: '#667eea', textDecoration: 'none' }}>What is ORO?</a></li>
              <li><a href="#how-it-works" style={{ color: '#667eea', textDecoration: 'none' }}>How It Works</a></li>
              <li><a href="#reputation-tiers" style={{ color: '#667eea', textDecoration: 'none' }}>Reputation Tiers</a></li>
              <li><a href="#use-cases" style={{ color: '#667eea', textDecoration: 'none' }}>Use Cases</a></li>
              <li><a href="#api-reference" style={{ color: '#667eea', textDecoration: 'none' }}>API Reference</a></li>
              <li><a href="#integration" style={{ color: '#667eea', textDecoration: 'none' }}>Integration Guide</a></li>
              <li><a href="#contract" style={{ color: '#667eea', textDecoration: 'none' }}>Smart Contract</a></li>
            </ul>
          </div>

          {/* Overview Section */}
          <section id="overview" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>What is ORO?</h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
              ORO (Onchain Reputation Oracle) is building the infrastructure for Web3 reputation. 
              We analyze onchain behavior patterns to create portable reputation scores that help 
              DeFi protocols make better risk decisions and reward trusted users.
            </p>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px' }}>
              Unlike traditional credit scores, ORO's reputation system is:
            </p>
            <ul style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px' }}>
              <li><strong>Transparent:</strong> Based on public onchain data</li>
              <li><strong>Portable:</strong> Works across all DeFi protocols</li>
              <li><strong>Real-time:</strong> Updates as behavior changes</li>
              <li><strong>Privacy-first:</strong> No personal information collected</li>
            </ul>
          </section>

          {/* How It Works */}
          <section id="how-it-works" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>How It Works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>1. Data Analysis</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  We analyze thousands of onchain data points including transaction history, 
                  DeFi interactions, and protocol usage patterns.
                </p>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>2. Score Generation</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Our algorithm generates a reputation score (0-100) based on risk patterns, 
                  reliability, and onchain behavior consistency.
                </p>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>3. Badge Minting</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>
                  Users can mint soulbound reputation badges that update in real-time 
                  and are non-transferable, ensuring authenticity.
                </p>
              </div>
            </div>
          </section>

          {/* Reputation Tiers */}
          <section id="reputation-tiers" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Reputation Tiers</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: '#667eea', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Score Range</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>80-100</td>
                    <td style={{ padding: '15px', color: '#28a745' }}>Never Defaulted</td>
                    <td style={{ padding: '15px', color: '#666' }}>Highest reputation tier with excellent onchain behavior</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>50-79</td>
                    <td style={{ padding: '15px', color: '#ffc107' }}>Good Standing</td>
                    <td style={{ padding: '15px', color: '#666' }}>Standard reputation tier with reliable behavior</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#333' }}>0-49</td>
                    <td style={{ padding: '15px', color: '#dc3545' }}>New/Unproven</td>
                    <td style={{ padding: '15px', color: '#666' }}>Basic reputation tier for new or unproven wallets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Use Cases */}
          <section id="use-cases" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Use Cases</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>DeFi Protocols</h3>
                <ul style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px' }}>
                  <li>Gate high-value transactions</li>
                  <li>Offer better rates to trusted users</li>
                  <li>Prevent fraud and abuse</li>
                </ul>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>Lending Platforms</h3>
                <ul style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px' }}>
                  <li>Determine loan terms</li>
                  <li>Reduce collateral requirements</li>
                  <li>Early warning for risky borrowers</li>
                </ul>
              </div>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>NFT Marketplaces</h3>
                <ul style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px' }}>
                  <li>Verify trusted sellers</li>
                  <li>Protect buyers from scams</li>
                  <li>Build community reputation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section id="api-reference" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>API Reference</h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              ORO provides a simple REST API for accessing reputation data:
            </p>
            
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Base URL</h4>
              <code style={{
                background: '#e9ecef',
                padding: '5px 10px',
                borderRadius: '5px',
                color: '#333'
              }}>
                https://orooracle-m67f4p5jy-loganstafford740-1721s-projects.vercel.app
              </code>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Get Wallet Score</h4>
              <code style={{
                background: '#e9ecef',
                padding: '5px 10px',
                borderRadius: '5px',
                color: '#333',
                display: 'block',
                marginBottom: '10px'
              }}>
                GET /score/:address
              </code>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Returns the reputation score and status for a given wallet address.
              </p>
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Get Badge Metadata</h4>
              <code style={{
                background: '#e9ecef',
                padding: '5px 10px',
                borderRadius: '5px',
                color: '#333',
                display: 'block',
                marginBottom: '10px'
              }}>
                GET /metadata/:address.json
              </code>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Returns ERC-721 compatible metadata for the reputation badge.
              </p>
            </div>
          </section>

          {/* Integration Guide */}
          <section id="integration" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Integration Guide</h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              Integrating ORO into your protocol is simple:
            </p>
            
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>JavaScript Example</h4>
              <pre style={{
                background: '#2d3748',
                color: '#e2e8f0',
                padding: '15px',
                borderRadius: '5px',
                overflow: 'auto',
                fontSize: '14px'
              }}>
{`const API_BASE = 'https://orooracle-m67f4p5jy-loganstafford740-1721s-projects.vercel.app';

async function getWalletScore(address) {
  const response = await fetch(\`\${API_BASE}/score/\${address}\`);
  return await response.json();
}

// Usage
const score = await getWalletScore('0x1234...');
console.log(\`Score: \${score.score}, Status: \${score.status}\`);`}
              </pre>
            </div>
          </section>

          {/* Smart Contract */}
          <section id="contract" style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Smart Contract</h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              ORO uses a soulbound ERC-721 contract for reputation badges:
            </p>
            
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#333', marginBottom: '10px' }}>Contract Details</h4>
              <ul style={{ color: '#666', lineHeight: '1.6', marginLeft: '20px' }}>
                <li><strong>Network:</strong> Sepolia Testnet</li>
                <li><strong>Address:</strong> <code>0x7fd112d62e3D32bD3667c878dfAf582B18d4266b</code></li>
                <li><strong>Type:</strong> Soulbound ERC-721 (Non-transferable)</li>
                <li><strong>Features:</strong> One badge per wallet, real-time updates</li>
              </ul>
            </div>
          </section>

          {/* Call to Action */}
          <div style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <h3 style={{ marginBottom: '15px' }}>Ready to Get Started?</h3>
            <p style={{ marginBottom: '20px', opacity: '0.9' }}>
              Try ORO's reputation system and see how it can improve your protocol.
            </p>
            <a href="/" style={{
              background: 'white',
              color: '#667eea',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              Try the Demo
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
