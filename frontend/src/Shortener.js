import React, { useState } from 'react';
import axios from 'axios';
import './Shortener.css';

function Shortener() {
  const [urls, setUrls] = useState([
    { originalUrl: '', validityMinutes: '', preferredCode: '' }
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const addRow = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validityMinutes: '', preferredCode: '' }]);
    }
  };

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const handleShorten = async () => {
    setError('');
    setResults([]);

    try {
      const res = await axios.post('http://localhost:5000/shorten', {
        urls: urls.filter(u => u.originalUrl) 
      });
      setResults(res.data.results);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="shortener-container">
      <h2>Enter up to 5 URLs</h2>

      {urls.map((urlObj, idx) => (
        <div key={idx} className="url-block">
          <input
            type="text"
            placeholder="Original URL"
            value={urlObj.originalUrl}
            onChange={(e) => handleChange(idx, 'originalUrl', e.target.value)}
          />
          <input
            type="number"
            placeholder="Validity (mins)"
            value={urlObj.validityMinutes}
            onChange={(e) => handleChange(idx, 'validityMinutes', e.target.value)}
          />
          <input
            type="text"
            placeholder="Preferred short code (optional)"
            value={urlObj.preferredCode}
            onChange={(e) => handleChange(idx, 'preferredCode', e.target.value)}
          />
        </div>
      ))}

      {urls.length < 5 && <button onClick={addRow}>+ Add Another</button>}

      <button onClick={handleShorten}>Shorten All</button>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <div className="result">
          <h3>Results:</h3>
          <ul>
            {results.map((res, i) => (
              <li key={i}>
                {res.shortUrl
                  ? <a href={res.shortUrl} target="_blank" rel="noreferrer">{res.shortUrl}</a>
                  : <span style={{ color: 'red' }}>Error: {res.error}</span>
                }
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Shortener;
