import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import './App.css';

// Import the route configuration
import { appRoutes } from './utils/routes';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          {appRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;