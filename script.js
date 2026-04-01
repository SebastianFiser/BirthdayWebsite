const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if(!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      root: null,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const birthTimeEl = document.getElementById("birth-time");
const knownTimeEl = document.getElementById("known-time");

const birthDate = new Date("2009-04-16T00:09:26");
const knownDate = new Date("2017-01-01T00:00:00");

function updateTimes() {
  if (!birthTimeEl || !knownTimeEl) return;

  const now = new Date();
  const birthDiff = now - birthDate;
  const knownDiff = now - knownDate;

  const totalSeconds = Math.floor(birthDiff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalYears = (totalDays / 365.25).toFixed(2);

  birthTimeEl.textContent = `Už je to ${totalYears} let (${totalDays} dní, ${totalHours} hodin, ${totalMinutes} minut, ${totalSeconds} sekund) od narození.`;

  const knownSeconds = Math.floor(knownDiff / 1000);
  const knownMinutes = Math.floor(knownSeconds / 60);
  const knownHours = Math.floor(knownMinutes / 60);
  const knownDays = Math.floor(knownHours / 24);
  const knownYears = (knownDays / 365.25).toFixed(2);

  knownTimeEl.textContent = `Známe se už ${knownYears} let (${knownDays} dní, ${knownHours} hodin, ${knownMinutes} minut, ${knownSeconds} sekund).`;
}

updateTimes();
setInterval(updateTimes, 1000);

const secretForm = document.getElementById("secret-form");
const secretInput = document.getElementById("secret-key");
const secretFeedback = document.getElementById("secret-feedback");
const secretContent = document.getElementById("secret-content");

const SECRET_PHRASE = "franta";

if (secretForm && secretInput && secretFeedback && secretContent) {
  secretForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = secretInput.value.trim().toLowerCase();

    if (value === SECRET_PHRASE) {
      secretContent.hidden = false;
      secretFeedback.textContent = "Odemčeno!";
      secretForm.querySelector("button").disabled = true;
      secretInput.disabled = true;
      return;
    }

    secretContent.hidden = true;
    secretFeedback.textContent = "Špatný klíč, zkus to znovu.";
  });
}

const showPlayerBtn = document.getElementById("play-music");
const spotifyWrap = document.getElementById("spotify-wrap");

if (showPlayerBtn && spotifyWrap) {
  showPlayerBtn.addEventListener("click", () => {
    spotifyWrap.hidden = false;
    showPlayerBtn.disabled = true;
    showPlayerBtn.textContent = "Playlist připraven";
  });
}