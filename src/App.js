import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Terminal from './pages/Terminal';
import About from './pages/About';
import Transmissions from './pages/Transmissions';
import Photos from './pages/Photos';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terminal" element={<Terminal onClose={() => window.location.href = '/'} />} />
          <Route path="/about" element={<About onClose={() => window.location.href = '/terminal'} />} />
          <Route path="/confessions" element={<Transmissions onClose={() => window.location.href = '/terminal'} />} />
          <Route path="/mailclub" element={<Photos onClose={() => window.location.href = '/terminal'} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
