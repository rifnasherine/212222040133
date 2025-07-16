import { nanoid } from 'nanoid';
import { logError } from '../services/logService.js';
const urlMap = {};
const getLocationFromIP = (ip) => {
  return "India (mocked)";
};

export const shortenUrl = async (req, res) => {
  try {
    const urlRequests = req.body.urls;

    if (!Array.isArray(urlRequests) || urlRequests.length === 0 || urlRequests.length > 5) {
      return res.status(400).json({ error: 'You must provide between 1 and 5 URLs.' });
    }

    const results = [];

    for (const item of urlRequests) {
      const { originalUrl, preferredCode, validityMinutes } = item;

      if (!originalUrl || !validityMinutes || isNaN(validityMinutes) || validityMinutes <= 0) {
        results.push({
          originalUrl,
          preferredCode,
          error: 'Missing or invalid fields (URL or validity).'
        });
        continue;
      }

      const code = preferredCode?.trim() || nanoid(6);

      if (urlMap[code]) {
        results.push({
          originalUrl,
          preferredCode: code,
          error: 'Short code already exists.'
        });
        continue;
      }

      const createdAt = new Date();
      const validUntil = new Date(createdAt.getTime() + validityMinutes * 60000);

      urlMap[code] = {
        originalUrl,
        createdAt,
        validUntil,
        clicks: 0,
        clickData: []
      };

      results.push({
        originalUrl,
        shortUrl: `http://localhost:${process.env.PORT}/${code}`
      });
    }

    res.json({ results });

  } catch (err) {
    await logError("backend", "error", "shortenUrl", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const redirectToOriginal = async (req, res) => {
  try {
    const { shortId } = req.params;
    const entry = urlMap[shortId];

    if (!entry) return res.status(404).send("URL Not Found");

    const now = new Date();
    if (now > new Date(entry.validUntil)) {
      return res.status(410).send("This short link has expired");
    }

    const source = req.get('User-Agent') || 'unknown';
    const ip = req.ip || req.connection.remoteAddress;
    const location = getLocationFromIP(ip);

    entry.clicks += 1;
    entry.clickData.push({
      timestamp: new Date(),
      source,
      location
    });

    res.redirect(entry.originalUrl);

  } catch (err) {
    await logError("backend", "error", "redirectToOriginal", err.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getUrlStats = async (req, res) => {
  try {
    const { shortId } = req.params;
    const entry = urlMap[shortId];

    if (!entry) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json({
      shortUrl: `http://localhost:${process.env.PORT}/${shortId}`,
      originalUrl: entry.originalUrl,
      createdAt: entry.createdAt,
      validUntil: entry.validUntil,
      clicks: entry.clicks,
      clickData: entry.clickData
    });

  } catch (err) {
    await logError("backend", "error", "getUrlStats", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
