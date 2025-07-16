import React, { useState } from 'react';
import axios from 'axios';
import './Shortener.css'; 

function Statistics() {
  const [shortId, setShortId] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setError('');
    setStats(null);

    if (!shortId.trim()) {
      setError("Please enter a short code");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/stats/${shortId.trim()}`);
      setStats(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Short URL not found.");
      } else {
        setError("Failed to fetch stats. Please try again.");
      }
    }
  };

  return (
    <div className="shortener-container">
      <h2>URL Statistics</h2>
      <input
        type="text"
        placeholder="Enter short code (e.g., abc123)"
        value={shortId}
        onChange={(e) => setShortId(e.target.value)}
      />
      <button onClick={fetchStats}>Get Stats</button>

      {error && <p className="error">{error}</p>}

      {stats && (
        <div className="result" style={{ textAlign: 'left' }}>
          <h3>Short URL: <a href={stats.shortUrl} target="_blank" rel="noreferrer">{stats.shortUrl}</a></h3>
          <p><strong>Original URL:</strong> {stats.originalUrl}</p>
          <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
          <p><strong>Expires At:</strong> {new Date(stats.validUntil).toLocaleString()}</p>
          <p><strong>Total Clicks:</strong> {stats.clicks}</p>

          {stats.clickData?.length > 0 && (
            <div>
              <h4>Click Logs:</h4>
              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Timestamp</th>
                    <th>Source</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.clickData.map((log, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.source}</td>
                      <td>{log.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Statistics;
