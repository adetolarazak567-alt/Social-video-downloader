const form = document.getElementById('form');
const input = document.getElementById('url');
const statusBox = document.getElementById('status');
const result = document.getElementById('result');
const thumb = document.getElementById('thumb');
const title = document.getElementById('title');
const formatsDiv = document.getElementById('formats');

function humanSize(bytes) {
  if (!bytes) return '';
  const units=['B','KB','MB','GB'];
  let i=0, b=bytes;
  while (b>=1024 && i<units.length-1) { b/=1024; i++; }
  return `${b.toFixed(1)} ${units[i]}`;
}

async function extract(url) {
  const res = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
  return res.json();
}

function formatCard(f) {
  const label = [f.resolution || '', f.ext?.toUpperCase() || '', f.hasAudio?'Audio✔':'No Audio']
    .filter(Boolean).join(' · ');
  const size = f.filesize ? ` · ${humanSize(f.filesize)}` : '';
  const div = document.createElement('div');
  div.className = 'format';
  div.innerHTML = `<div>${label}${size}</div><a href=\"${f.url}\" download>Download</a>`;
  return div;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = input.value.trim();
  statusBox.classList.remove('hidden');
  statusBox.textContent = 'Fetching…';
  result.classList.add('hidden');
  formatsDiv.innerHTML = '';

  try {
    const data = await extract(url);
    if (!data.ok) throw new Error(data.error);
    title.textContent = data.meta.title;
    if (data.meta.thumb) thumb.src = data.meta.thumb;
    data.meta.formats.forEach(f => formatsDiv.appendChild(formatCard(f)));
    statusBox.classList.add('hidden');
    result.classList.remove('hidden');
  } catch(err) {
    statusBox.textContent = 'Error: ' + err.message;
  }
});