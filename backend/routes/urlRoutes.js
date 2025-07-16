import express from 'express';
import {
  shortenUrl,
  redirectToOriginal,
  getUrlStats
} from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/:shortId', redirectToOriginal);
router.get('/stats/:shortId', getUrlStats); // 📊 NEW ROUTE

export default router;
