
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/glassmorphism.css'

// Preload the new logo
const preloadLogo = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/lovable-uploads/6dada9e0-7c2b-4be1-8795-cb8580fec628.png';
  link.as = 'image';
  document.head.appendChild(link);
};

// Execute preload
preloadLogo();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
