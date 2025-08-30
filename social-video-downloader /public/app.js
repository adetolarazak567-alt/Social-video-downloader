const form = document.getElementById('form');
const input = document.getElementById('url');
const statusBox = document.getElementById('status');
const resultSection = document.getElementById('result');
const thumb = document.getElementById('thumb');
const title = document.getElementById('title');
const formatsDiv = document.getElementById('formats');

// Your app.js uses:
const API_URL = "https://social-video-downloader-14.onrender.com"; 
// On Railway, you will replace this with your Railway URL once deployed
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const videoURL = input.value.trim();
  if (!videoURL) return;

  // Show status
  statusBox.textContent = "Fetching video info...";
  statusBox.classList.remove('hidden');
  resultSection.classList.add('hidden');
  formatsDiv.innerHTML = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoURL })
    });

    const data = await response.json();

    if (data.error) {
      statusBox.textContent = data.error;
      return;
    }

    // Show video info
    statusBox.classList.add('hidden');
    resultSection.classList.remove('hidden');
    thumb.src = data.thumbnail || '';
    title.textContent = data.title || 'Video';

    // Populate formats
    data.formats.forEach(format => {
      const btn = document.createElement('a');
      btn.href = format.url;
      btn.textContent = `${format.quality} - ${format.ext}`;
      btn.className = 'format-btn';
      btn.target = "_blank";
      formatsDiv.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
    statusBox.textContent = "Failed to fetch video info. Try again.";
  }
});