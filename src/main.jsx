import React from 'react'
import ReactDOM from 'react-dom/client'
import WhopAppWrapper from './components/WhopAppWrapper.jsx'
import './index.css'

console.log('Main.jsx loading...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WhopAppWrapper />
  </React.StrictMode>,
)