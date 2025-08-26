import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import APUSHTerms from './pages/apushTerms';
import WorldTerms from './pages/worldTerms';
import EuroTerms from './pages/euroTerms';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apush" element={<APUSHTerms />} />
          <Route path="/ap-world" element={<WorldTerms />} />
          <Route path="/ap-euro" element={<EuroTerms />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;