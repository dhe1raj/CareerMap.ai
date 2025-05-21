
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/glassmorphism.css'

// Preload the new logo
const preloadLogo = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/lovable-uploads/9ae4cbff-f439-40be-949e-407cd109074b.png';
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
