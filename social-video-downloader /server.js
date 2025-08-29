import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Social Video Downloader Server is running!");
});

// Example download route
app.post("/download", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  const ytdlpPath = process.env.YTDLP_PATH || "yt-dlp";
  const command = `${ytdlpPath} -j ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({ error: "Download failed" });
    }

    try {
      const data = JSON.parse(stdout);
      res.json({
        title: data.title,
        thumbnail: data.thumbnail,
        formats: data.formats.map(f => ({
          url: f.url,
          quality: f.format_note,
          ext: f.ext
        }))
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to parse video info" });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});