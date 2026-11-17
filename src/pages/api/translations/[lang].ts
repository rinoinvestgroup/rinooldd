import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lang } = req.query;

  if (!lang || typeof lang !== 'string') {
    return res.status(400).json({ error: 'Language parameter is required' });
  }

  const supportedLanguages = ['en', 'ar', 'es', 'zh', 'de'];
  
  if (!supportedLanguages.includes(lang)) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', lang, 'common.json');
    
    if (!fs.existsSync(filePath)) {
      // Fallback to English if the requested language file doesn't exist
      const fallbackPath = path.join(process.cwd(), 'public', 'locales', 'en', 'common.json');
      if (fs.existsSync(fallbackPath)) {
        const fallbackData = fs.readFileSync(fallbackPath, 'utf8');
        return res.status(200).json(JSON.parse(fallbackData));
      } else {
        return res.status(404).json({ error: 'Translation file not found' });
      }
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);

    // Detect Brave browser and adjust cache headers
    const userAgent = req.headers['user-agent'] || '';
    const isBrave = userAgent.includes('Brave');
    
    // Set cache headers - shorter cache for Brave to prevent stale data
    if (isBrave) {
      res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Vary', 'User-Agent'); // Important: cache separately per browser
    
    return res.status(200).json(translations);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load translations' });
  }
}
