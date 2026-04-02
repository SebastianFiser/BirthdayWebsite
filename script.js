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

const birthUnitEls = {
  years: document.getElementById("birth-years"),
  months: document.getElementById("birth-months"),
  days: document.getElementById("birth-days"),
  hours: document.getElementById("birth-hours"),
  minutes: document.getElementById("birth-minutes"),
  seconds: document.getElementById("birth-seconds"),
};

const knownUnitEls = {
  years: document.getElementById("known-years"),
  months: document.getElementById("known-months"),
  days: document.getElementById("known-days"),
  hours: document.getElementById("known-hours"),
  minutes: document.getElementById("known-minutes"),
  seconds: document.getElementById("known-seconds"),
};

const birthDate = new Date("2009-04-16T00:09:26");
const knownDate = new Date("2017-01-01T00:00:00");

function updateTimes() {
  const now = new Date();

  function getTimeParts(startDate, endDate) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    let hours = endDate.getHours() - startDate.getHours();
    let minutes = endDate.getMinutes() - startDate.getMinutes();
    let seconds = endDate.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }

    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }

    if (hours < 0) {
      hours += 24;
      days -= 1;
    }

    if (days < 0) {
      const previousMonthDays = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
      days += previousMonthDays;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days, hours, minutes, seconds };
  }

  function writeParts(target, parts) {
    if (!target) return;
    target.years.textContent = parts.years;
    target.months.textContent = parts.months;
    target.days.textContent = parts.days;
    target.hours.textContent = parts.hours;
    target.minutes.textContent = parts.minutes;
    target.seconds.textContent = parts.seconds;
  }

  writeParts(birthUnitEls, getTimeParts(birthDate, now));
  writeParts(knownUnitEls, getTimeParts(knownDate, now));
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

// Memory carousel scroll lock
const memoriesSection = document.getElementById("memories");
const memoriesList = document.querySelector(".memories-list");
const memoryItems = document.querySelectorAll(".memory-item");

if (memoriesList && memoryItems.length > 0) {
  let currentMemoryIndex = 0;
  let memoriesInView = false;

  function showMemory(index, behavior = "smooth") {
    const maxIndex = memoryItems.length - 1;
    currentMemoryIndex = Math.max(0, Math.min(index, maxIndex));

    memoriesList.scrollTo({
      left: currentMemoryIndex * memoriesList.clientWidth,
      behavior,
    });
  }

  const memoriesObserver = new IntersectionObserver(
    ([entry]) => {
      memoriesInView = entry.isIntersecting && entry.intersectionRatio >= 0.7;
    },
    {
      threshold: [0.7],
    }
  );

  if (memoriesSection) {
    memoriesObserver.observe(memoriesSection);
  }

  showMemory(0, "auto");

  window.addEventListener("resize", () => showMemory(currentMemoryIndex, "auto"));

  document.addEventListener(
    "wheel",
    (event) => {
      if (!memoriesInView) return;

      const maxIndex = memoryItems.length - 1;
      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;

      if (scrollingDown && currentMemoryIndex < maxIndex) {
        event.preventDefault();
        showMemory(currentMemoryIndex + 1);
        return;
      }

      if (scrollingUp && currentMemoryIndex > 0) {
        event.preventDefault();
        showMemory(currentMemoryIndex - 1);
      }
    },
    { passive: false }
  );
}