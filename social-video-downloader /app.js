const API_URL = 'https://YOUR_PERMANENT_DEPLOYMENT_URL'; // optional, or just call directly
const RAPIDAPI_URL = 'https://download-all-in-one-elite.p.rapidapi.com/';
const RAPIDAPI_KEY = '1cc2a2724cmshb3a716d3dbd51e8p1dd3d4jsn1b77fdb09e5c'; // your RapidAPI key

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const videoURL = input.value.trim();
  if (!videoURL) return;

  statusBox.textContent = "Fetching video info...";
  statusBox.classList.remove('hidden');
  resultSection.classList.add('hidden');
  formatsDiv.innerHTML = '';

  try {
    const apiResponse = await fetch(RAPIDAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'download-all-in-one-elite.p.rapidapi.com'
      },
      body: JSON.stringify({ url: videoURL })
    });

    const data = await apiResponse.json();
    if (data.error) {
      statusBox.textContent = data.error.message || 'Error fetching video';
      return;
    }

    statusBox.classList.add('hidden');
    resultSection.classList.remove('hidden');
    thumb.src = data.thumbnail || '';
    title.textContent = data.title || 'Video';

    (data.formats || []).forEach(format => {
      const btn = document.createElement('a');
      btn.href = format.url;
      btn.textContent = `${format.quality || format.format} - ${format.ext}`;
      btn.className = 'format-btn';
      btn.target = "_blank";
      formatsDiv.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
    statusBox.textContent = "Failed to fetch video info. Try again.";
  }
});


