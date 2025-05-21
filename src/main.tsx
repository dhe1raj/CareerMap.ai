
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/glassmorphism.css';
import { HelmetProvider } from 'react-helmet-async';

// Preload critical resources
const preloadResources = () => {
  // Preload logo
  const logoLink = document.createElement('link');
  logoLink.rel = 'preload';
  logoLink.href = '/lovable-uploads/6dada9e0-7c2b-4be1-8795-cb8580fec628.png';
  logoLink.as = 'image';
  document.head.appendChild(logoLink);
  
  // Preconnect to important domains
  const domains = [
    'https://cdn.gpteng.co',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  domains.forEach(domain => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = domain;
    document.head.appendChild(preconnect);
  });
};

// Execute preload
preloadResources();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
