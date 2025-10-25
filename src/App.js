import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
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
          <Route path="/about" element={<About onClose={() => window.history.back()} />} />
          <Route path="/confessions" element={<Transmissions onClose={() => window.history.back()} />} />
          <Route path="/mailclub" element={<Photos onClose={() => window.history.back()} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
