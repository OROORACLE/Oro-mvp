import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [address, setAddress] = useState('');
  const [score, setScore] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const isValidAddress = (addr) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const checkScore = async () => {
    if (!isValidAddress(address)) {
      setError('Please enter a valid Ethereum address (0x...)');
      return;
    }

    setLoading(true);
    setError('');
    setScore(null);
    setMetadata(null);

    try {
      // Fetch score
      const scoreResponse = await fetch(`${apiBaseUrl}/score/${address}`);
      if (!scoreResponse.ok) {
        throw new Error('Failed to fetch score');
      }
      const scoreData = await scoreResponse.json();
      setScore(scoreData);

      // Fetch metadata
      const metadataResponse = await fetch(`${apiBaseUrl}/metadata/${address}.json`);
      if (!metadataResponse.ok) {
        throw new Error('Failed to fetch metadata');
      }
      const metadataData = await metadataResponse.json();
      setMetadata(metadataData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 50) return '#3b82f6'; // blue
    return '#f59e0b'; // amber
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return '#ecfdf5'; // emerald-50
    if (score >= 50) return '#eff6ff'; // blue-50
    return '#fffbeb'; // amber-50
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    nav: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50
    },
    navContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    logoSubtext: {
      fontSize: '12px',
      color: '#64748b',
      fontWeight: '500'
    },
    hero: {
      padding: '80px 0 64px',
      textAlign: 'center'
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '24px',
      lineHeight: '1.1'
    },
    heroGradient: {
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    heroSubtitle: {
      fontSize: '20px',
      color: '#475569',
      marginBottom: '32px',
      maxWidth: '768px',
      margin: '0 auto 32px',
      lineHeight: '1.6'
    },
    demoCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '48px',
      maxWidth: '896px',
      margin: '0 auto'
    },
    inputGroup: {
      marginBottom: '32px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '12px'
    },
    input: {
      width: '100%',
      padding: '16px 24px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '18px',
      fontFamily: 'monospace',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.2s ease-in-out'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.1)'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      transform: 'scale(1)'
    },
    buttonHover: {
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      transform: 'scale(1.02)'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'scale(1)'
    },
    errorCard: {
      background: '#fef2f2',
      border: '2px solid #fecaca',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    scoreCard: {
      borderRadius: '16px',
      padding: '32px',
      border: '2px solid',
      marginBottom: '32px'
    },
    scoreTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '8px',
      textAlign: 'center'
    },
    scoreSubtitle: {
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '24px'
    },
    scoreGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '32px'
    },
    scoreItem: {
      textAlign: 'center'
    },
    scoreNumber: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '8px'
    },
    scoreLabel: {
      color: '#64748b',
      fontWeight: '500'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e2e8f0',
      borderRadius: '4px',
      marginTop: '12px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 1s ease-in-out'
    },
    badgeCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(8px)',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '32px'
    },
    badgeTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '24px',
      textAlign: 'center'
    },
    badgeContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '32px'
    },
    badgeImage: {
      width: '192px',
      height: '192px',
      borderRadius: '16px',
      border: '4px solid white',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    badgeInfo: {
      textAlign: 'center',
      flex: 1
    },
    badgeName: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '16px'
    },
    badgeDescription: {
      color: '#64748b',
      fontSize: '18px',
      marginBottom: '24px',
      lineHeight: '1.6'
    },
    attributesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px'
    },
    attributeCard: {
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '16px'
    },
    attributeLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500',
      marginBottom: '4px'
    },
    attributeValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#0f172a'
    }
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>ORO - Onchain Reputation Oracle</title>
        <meta name="description" content="The future of Web3 reputation. Score wallets based on onchain behavior." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>🛡️</span>
            </div>
            <div>
              <div style={styles.logoText}>ORO</div>
              <div style={styles.logoSubtext}>Onchain Reputation Oracle</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>Docs</a>
            <a href="#" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>API</a>
            <a href="#" style={{ color: '#64748b', fontWeight: '500', textDecoration: 'none' }}>About</a>
            <button style={{
              background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={styles.heroTitle}>
            The Future of{' '}
            <span style={styles.heroGradient}>
              Web3 Reputation
            </span>
          </h1>
          <p style={styles.heroSubtitle}>
            Score wallets based on onchain behavior. Make reputation portable across protocols. 
            Reduce risk, reward trusted users, and gate features intelligently.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={styles.demoCard}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px' }}>
                Try the Demo
              </h2>
              <p style={{ color: '#64748b', fontSize: '18px' }}>
                Enter any Ethereum address to see their onchain reputation score
              </p>
            </div>
            
            {/* Input Section */}
            <div style={styles.inputGroup}>
              <label htmlFor="address" style={styles.label}>
                Ethereum Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x1234567890123456789012345678901234567890"
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <button
              onClick={checkScore}
              disabled={loading || !address}
              style={{
                ...styles.button,
                ...(loading || !address ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!loading && address) {
                  Object.assign(e.target.style, styles.buttonHover);
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Check Reputation Score'
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div style={styles.errorCard}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: '#fecaca',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#dc2626', fontSize: '14px' }}>⚠</span>
                </div>
                <p style={{ color: '#dc2626', fontWeight: '500' }}>{error}</p>
              </div>
            )}

            {/* Results Section */}
            {score && (
              <div style={{ marginTop: '32px' }}>
                {/* Score Card */}
                <div style={{
                  ...styles.scoreCard,
                  background: getScoreBgColor(score.score),
                  borderColor: getScoreColor(score.score)
                }}>
                  <div style={styles.scoreTitle}>Reputation Analysis</div>
                  <div style={styles.scoreSubtitle}>Based on onchain behavior patterns</div>
                  
                  <div style={styles.scoreGrid}>
                    <div style={styles.scoreItem}>
                      <div style={{ ...styles.scoreNumber, color: getScoreColor(score.score) }}>
                        {score.score}
                      </div>
                      <div style={styles.scoreLabel}>Score (0-100)</div>
                      <div style={styles.progressBar}>
                        <div 
                          style={{
                            ...styles.progressFill,
                            width: `${score.score}%`,
                            background: getScoreColor(score.score)
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div style={styles.scoreItem}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
                        {score.status}
                      </div>
                      <div style={styles.scoreLabel}>Status</div>
                      <div style={{ marginTop: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          fontSize: '14px',
                          fontWeight: '500',
                          background: score.score >= 80 ? '#d1fae5' : score.score >= 50 ? '#dbeafe' : '#fef3c7',
                          color: score.score >= 80 ? '#065f46' : score.score >= 50 ? '#1e40af' : '#92400e'
                        }}>
                          {score.score >= 80 ? '🟢 Excellent' : 
                           score.score >= 50 ? '🔵 Good' : '🟡 Developing'}
                        </span>
                      </div>
                    </div>
                    
                    <div style={styles.scoreItem}>
                      <div style={{ fontSize: '14px', fontFamily: 'monospace', color: '#64748b', marginBottom: '8px', wordBreak: 'break-all' }}>
                        {score.address}
                      </div>
                      <div style={styles.scoreLabel}>Wallet Address</div>
                      <div style={{ marginTop: '12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f1f5f9',
                          color: '#475569'
                        }}>
                          📊 Analyzed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Display */}
                {metadata && (
                  <div style={styles.badgeCard}>
                    <h3 style={styles.badgeTitle}>ORO Reputation Badge</h3>
                    <div style={styles.badgeContent}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={metadata.image}
                          alt="ORO Badge"
                          style={styles.badgeImage}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                        </div>
                      </div>
                      <div style={styles.badgeInfo}>
                        <h4 style={styles.badgeName}>{metadata.name}</h4>
                        <p style={styles.badgeDescription}>{metadata.description}</p>
                        <div style={styles.attributesGrid}>
                          {metadata.attributes.map((attr, index) => (
                            <div key={index} style={styles.attributeCard}>
                              <div style={styles.attributeLabel}>{attr.trait_type}</div>
                              <div style={styles.attributeValue}>{attr.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0f172a',
        color: 'white',
        padding: '64px 0',
        marginTop: '64px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8' }}>
            ORO - Onchain Reputation Oracle • Built for Web3
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
