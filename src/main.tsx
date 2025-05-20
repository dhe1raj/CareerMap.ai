
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/glassmorphism.css'

// Preload the new logo
const preloadLogo = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/lovable-uploads/d2d8e0ba-043a-43ca-89a4-25cc3de159b4.png';
  link.as = 'image';
  document.head.appendChild(link);
};

// Execute preload
preloadLogo();

// Add console log for debugging
console.log('Application starting...');
console.log('Initializing providers and routing...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
