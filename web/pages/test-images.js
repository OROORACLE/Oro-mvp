import React from 'react';
import Head from 'next/head';

const TestImages = () => {
  return (
    <>
      <Head>
        <title>Test Badge Images</title>
      </Head>
      
      <div style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1>Testing Badge Images</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Never Defaulted</h2>
          <img 
            src="https://raw.githubusercontent.com/OROORACLE/oro-mvp/master/images/badges/never-defaulted.png" 
            alt="Never Defaulted" 
            style={{ 
              width: '200px', 
              border: '1px solid #ccc',
              display: 'block',
              marginBottom: '10px'
            }}
            onLoad={() => console.log('✅ Never Defaulted loaded successfully')}
            onError={() => console.log('❌ Never Defaulted failed to load')}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>Good Standing</h2>
          <img 
            src="https://raw.githubusercontent.com/OROORACLE/oro-mvp/master/images/badges/good-standing.png" 
            alt="Good Standing" 
            style={{ 
              width: '200px', 
              border: '1px solid #ccc',
              display: 'block',
              marginBottom: '10px'
            }}
            onLoad={() => console.log('✅ Good Standing loaded successfully')}
            onError={() => console.log('❌ Good Standing failed to load')}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <h2>New/Unproven</h2>
          <img 
            src="https://raw.githubusercontent.com/OROORACLE/oro-mvp/master/images/badges/new-unproven.png" 
            alt="New/Unproven" 
            style={{ 
              width: '200px', 
              border: '1px solid #ccc',
              display: 'block',
              marginBottom: '10px'
            }}
            onLoad={() => console.log('✅ New/Unproven loaded successfully')}
            onError={() => console.log('❌ New/Unproven failed to load')}
          />
        </div>
        
        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px' 
        }}>
          <h3>Instructions:</h3>
          <p>1. Open browser console (F12)</p>
          <p>2. Check if you see ✅ success messages or ❌ error messages</p>
          <p>3. If images don't show, check the Network tab for failed requests</p>
        </div>
      </div>
    </>
  );
};

export default TestImages;
