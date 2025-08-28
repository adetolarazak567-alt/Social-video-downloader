import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import pino from 'pino';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

const PORT = process.env.PORT || 8080;
const YTDLP = process.env.YTDLP_PATH || 'yt-dlp';
const LOCKER_URL = process.env.LOCKER_URL || '';

const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }
}));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('tiny'));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 45 });
app.use('/api/', limiter);

app.use(express.static(resolve(__dirname, 'public')));

const VALID_URL = /^(https?:\\/\\/)[^\\s]+$/i;

function execYtDlpJson(url) {
  return new Promise((resolveP, rejectP) => {
    const args = ['-J', '--no-warnings', '--no-playlist', '--skip-download', url];
    execFile(YTDLP, args, { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) return rejectP(new Error(stderr || err.message));
      try {
        resolveP(JSON.parse(stdout));
      } catch {
        rejectP(new Error('Failed to parse yt-dlp output'));
      }
    });
  });
}

function extractFormats(info) {
  const results = [];
  const title = info.title || 'video';
  const thumb = Array.isArray(info.thumbnails) && info.thumbnails.length
    ? info.thumbnails.at(-1).url
    : info.thumbnail || '';

  if (Array.isArray(info.formats)) {
    for (const f of info.formats) {
      if (!f.url) continue;
      if (!f.vcodec || f.vcodec === 'none') continue;
      results.push({
        url: f.url,
        ext: f.ext,
        format_note: f.format_note || '',
        filesize: f.filesize || f.filesize_approx || null,
        resolution: f.height ? `${f.height}p` : '',
        hasAudio: f.acodec && f.acodec !== 'none'
      });
    }
  }
  return { title, thumb, formats: results };
}

app.get('/api/extract', async (req, res) => {
  try {
    const url = (req.query.url || '').toString().trim();
    if (!url || !VALID_URL.test(url)) {
      return res.status(400).json({ ok: false, error: 'Invalid or missing URL' });
    }
    const info = await execYtDlpJson(url);
    const payload = extractFormats(info);
    res.json({ ok: true, meta: payload });
  } catch (e) {
    logger.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});