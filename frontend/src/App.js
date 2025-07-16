import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Shortener from './Shortener';
import Statistics from './Statistics';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>URL Shortener</h1>
        <nav>
          <Link to="/" style={{ marginRight: '20px' }}>Shorten URL</Link>
          <Link to="/stats">View Stats</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Shortener />} />
          <Route path="/stats" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
