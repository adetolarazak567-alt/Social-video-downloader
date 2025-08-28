// Fade-in animation on scroll
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});



// =========================
// Smooth Scrolling
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// =========================
// Fade-in Animations on Scroll
// =========================
function applyFadeIn(element) {
  element.classList.add("fade-in");
  setTimeout(() => {
    element.classList.add("appear");
  }, 100); // delay for fade animation
}

// =========================
// Floating "Back to Top" Button
// =========================
const backToTopBtn = document.createElement("button");
backToTopBtn.innerText = "↑";
backToTopBtn.id = "backToTop";
document.body.appendChild(backToTopBtn);

backToTopBtn.style.position = "fixed";
backToTopBtn.style.bottom = "20px";
backToTopBtn.style.right = "20px";
backToTopBtn.style.padding = "10px 15px";
backToTopBtn.style.border = "none";
backToTopBtn.style.borderRadius = "50%";
backToTopBtn.style.background = "#2563eb";
backToTopBtn.style.color = "#fff";
backToTopBtn.style.cursor = "pointer";
backToTopBtn.style.fontSize = "18px";
backToTopBtn.style.display = "none";
backToTopBtn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// =========================
// Randomized Fake Earnings
// =========================
document.addEventListener("DOMContentLoaded", function () {
  const earningsFeed = document.getElementById("earningsFeed");

  const names = [
    "Anna", "David", "Sophia", "James", "Emily", "Michael", "Daniel", "Grace",
    "Chris", "Lisa", "Robert", "Ella", "Mark", "Olivia", "Nathan", "Mia",
    "Ethan", "Chloe", "Leo", "Sarah", "John", "Alex", "Isabella", "Jacob"
  ];
  const avatars = ["👩", "👨"];
  const comments = [
    "Finally hit my first $18 cashout, super happy!",
    "Easy to use, already made more than expected.",
    "Legit platform, I cashed out instantly!",
    "Didn’t expect to earn this quick, wow!",
    "Reached payout so fast, can’t believe it.",
    "Straight into PayPal, no stress.",
    "Even small cashouts feel good when it’s real money.",
    "Cashed out in minutes, really works.",
    "Best legit earning site I’ve found.",
    "Was able to buy groceries with this!",
    "Quick and simple, I’m definitely using this daily.",
    "Biggest cashout so far, thank you!",
    "Not bad for just signing up and using it.",
    "Going for the bigger cashouts next!",
    "This site is actually paying, respect!",
    "Love how the payout minimum is just $10.",
    "Got paid my first day, already hooked!",
    "It’s real, the money came through instantly.",
    "Not much yet but definitely real money."
  ];

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateEarning() {
    const name = names[getRandom(0, names.length - 1)];
    const avatar = avatars[getRandom(0, avatars.length - 1)];
    const amount = getRandom(10, 200);
    const comment = comments[getRandom(0, comments.length - 1)];

    const wrapper = document.createElement("div");
    wrapper.classList.add("earning");
    wrapper.innerHTML = `
      <div class="avatar">${avatar}</div>
      <div>
        <span>${name} earned <strong>$${amount}</strong></span>
        <p class="comment">“${comment}”</p>
      </div>
    `;

    applyFadeIn(wrapper);
    return wrapper;
  }

  // Load initial 12 earnings
  for (let i = 0; i < 12; i++) {
    earningsFeed.appendChild(generateEarning());
  }

  // Every 5s, remove oldest & add new earning at bottom
  setInterval(() => {
    if (earningsFeed.firstElementChild) {
      earningsFeed.removeChild(earningsFeed.firstElementChild);
    }
    earningsFeed.appendChild(generateEarning());
  }, 5000);
});
