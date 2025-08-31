// app.js (Frontend JS)

const form = document.getElementById('form');
const input = document.getElementById('url');
const statusBox = document.getElementById('status');
const resultSection = document.getElementById('result');
const formatsDiv = document.getElementById('formats');
const thumb = document.getElementById('thumb');
const title = document.getElementById('title');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let videoURL = input.value.trim();
  if (!videoURL) return;

  statusBox.textContent = "Fetching video info...";
  statusBox.classList.remove('hidden');
  resultSection.classList.add('hidden');
  formatsDiv.innerHTML = '';

  try {
    // --- Call your backend (Glitch server) instead of RapidAPI directly ---
    const apiResponse = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoURL })
    });

    const data = await apiResponse.json();
    console.log("API Response:", data);

    if (!data || !data.links || data.links.length === 0) {
      statusBox.textContent = "Download video not found. Try another link.";
      return;
    }

    // --- Platform logos ---
    const platformLogos = {
      facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
      tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046129.png",
      instagram: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
      youtube: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
      default: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
    };

    function detectPlatform(url) {
      url = url.toLowerCase();
      if (url.includes("facebook.com")) return "facebook";
      if (url.includes("twitter.com") || url.includes("x.com") || url.includes("t.co")) return "twitter";
      if (url.includes("tiktok.com") || url.includes("vm.tiktok.com") || url.includes("vt.tiktok.com")) return "tiktok";
      if (url.includes("instagram.com")) return "instagram";
      if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
      return "default";
    }

    // --- Show results ---
    statusBox.classList.add("hidden");
    resultSection.classList.remove("hidden");
    thumb.src = data.thumbnail || "";
    title.textContent = data.title || "Video";

    (data.links || []).forEach(format => {
      const platform = detectPlatform(videoURL);
      const btn = document.createElement("a");
      btn.href = format.link;
      btn.target = "_blank";
      btn.className = "format-btn";

      const img = document.createElement("img");
      img.src = platformLogos[platform];
      img.alt = platform;
      img.style.width = "20px";
      img.style.height = "20px";
      img.style.marginRight = "5px";

      btn.appendChild(img);
      btn.appendChild(document.createTextNode(`${format.quality || "Download"} - ${format.type || "video"}`));
      formatsDiv.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
    statusBox.textContent = "Failed to fetch video info. Try again.";
  }
});