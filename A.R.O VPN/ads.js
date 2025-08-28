// ads.js
const ads = [
    {
        id: "1", // unique ID for this ad
        title: "My Ad 1", // descriptive title
        type: "banner", // e.g., "banner", "popup", "video"
        created: "2025-08-26", // creation date (YYYY-MM-DD)
        zone: "166305", // zone ID from their platform
        code: `<script src="https://fpyf8.com/88/tag.min.js" data-zone="166305" async data-cfasync="false"></script>`
    },
    // Add more ad objects here if you want multiple ads
];

// Function to display an ad
function displayAd(adIndex) {
    if (!ads[adIndex]) return;
    const adContainer = document.getElementById("ad-container");
    if (adContainer) {
        adContainer.innerHTML = ads[adIndex].code;
    }
}