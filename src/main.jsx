import React from 'react'
import ReactDOM from 'react-dom'
import WhopAppWrapper from './components/WhopAppWrapper.jsx'
import './index.css'

console.log('Main.jsx loading...');

// Use React 18 style rendering for compatibility
ReactDOM.render(
  <React.StrictMode>
    <WhopAppWrapper />
  </React.StrictMode>,
  document.getElementById('root')
)