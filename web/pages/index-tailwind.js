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
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-amber-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'bg-blue-50 border-blue-200';
    return 'bg-amber-50 border-amber-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Head>
        <title>ORO - Onchain Reputation Oracle</title>
        <meta name="description" content="The future of Web3 reputation. Score wallets based on onchain behavior." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ORO</h1>
                <p className="text-xs text-slate-500 font-medium">Onchain Reputation Oracle</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Docs</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">API</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About</a>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              The Future of{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Web3 Reputation
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Score wallets based on onchain behavior. Make reputation portable across protocols. 
              Reduce risk, reward trusted users, and gate features intelligently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-sm text-slate-500">Trusted by leading DeFi protocols</div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Try the Demo
              </h2>
              <p className="text-slate-600 text-lg">
                Enter any Ethereum address to see their onchain reputation score
              </p>
            </div>
            
            {/* Input Section */}
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-3">
                  Ethereum Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x1234567890123456789012345678901234567890"
                    className="w-full px-6 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg font-mono bg-white/80 backdrop-blur-sm"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={checkScore}
                disabled={loading || !address}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Check Reputation Score'
                )}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-sm">⚠</span>
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {score && (
              <div className="space-y-8">
                {/* Score Card */}
                <div className={`${getScoreBgColor(score.score)} border-2 rounded-2xl p-8`}>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Reputation Analysis</h3>
                    <p className="text-slate-600">Based on onchain behavior patterns</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getScoreColor(score.score)} mb-2`}>
                        {score.score}
                      </div>
                      <div className="text-slate-600 font-medium">Score (0-100)</div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            score.score >= 80 ? 'bg-emerald-500' : 
                            score.score >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${score.score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-2">{score.status}</div>
                      <div className="text-slate-600 font-medium">Status</div>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          score.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          score.score >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {score.score >= 80 ? '🟢 Excellent' : 
                           score.score >= 50 ? '🔵 Good' : '🟡 Developing'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-sm font-mono text-slate-600 mb-2 break-all">
                        {score.address}
                      </div>
                      <div className="text-slate-600 font-medium">Wallet Address</div>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          📊 Analyzed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Display */}
                {metadata && (
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">ORO Reputation Badge</h3>
                    <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={metadata.image}
                            alt="ORO Badge"
                            className="w-48 h-48 rounded-2xl border-4 border-white shadow-2xl"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <h4 className="text-3xl font-bold text-slate-900 mb-4">{metadata.name}</h4>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">{metadata.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {metadata.attributes.map((attr, index) => (
                            <div key={index} className="bg-slate-50 rounded-xl p-4">
                              <div className="text-sm text-slate-500 font-medium mb-1">{attr.trait_type}</div>
                              <div className="text-lg font-bold text-slate-900">{attr.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                  <h4 className="text-xl font-bold text-slate-900 mb-6 text-center">What This Means</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-indigo-600 text-xl">🔒</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 mb-2">Risk Assessment</h5>
                      <p className="text-sm text-slate-600">Lower scores indicate higher risk profiles</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-600 text-xl">⚡</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 mb-2">Real-time Updates</h5>
                      <p className="text-sm text-slate-600">Scores update as onchain behavior changes</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <span className="text-pink-600 text-xl">🌐</span>
                      </div>
                      <h5 className="font-semibold text-slate-900 mb-2">Cross-Protocol</h5>
                      <p className="text-sm text-slate-600">Reputation follows you across all DeFi</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🛡️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">ORO</h3>
                  <p className="text-slate-400 text-sm">Onchain Reputation Oracle</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The future of Web3 reputation. Score wallets based on onchain behavior and make reputation portable across protocols.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Discord</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 ORO Oracle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
