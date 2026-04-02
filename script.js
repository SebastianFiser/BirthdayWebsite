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
      const secretSection = secretForm.closest("#inside-joke");

      secretContent.classList.remove("is-visible");
      secretContent.hidden = false;
      if (secretSection) {
        secretSection.classList.add("vault-unlocked");
      }

      secretFeedback.textContent = "Odemčeno!";
      secretForm.querySelector("button").disabled = true;
      secretInput.disabled = true;

      window.setTimeout(() => {
        secretContent.classList.add("is-visible");
      }, 90);

      return;
    }

    secretContent.classList.remove("is-visible");
    secretContent.hidden = true;
    secretFeedback.textContent = "Špatný klíč, zkus to znovu.";
  });
}

const trackCards = document.querySelectorAll(".track-card");
const spotifyWrap = document.getElementById("spotify-wrap");
const musicPlayer = document.getElementById("music-player");
const musicNowPlaying = document.getElementById("music-now-playing");

if (trackCards.length > 0 && spotifyWrap && musicPlayer && musicNowPlaying) {
  const setActiveTrack = (trackCard) => {
    const trackId = trackCard.dataset.trackId;
    const trackTitle = trackCard.dataset.trackTitle || "Selected track";
    const trackArtist = trackCard.dataset.trackArtist || "";
    const embedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;

    spotifyWrap.hidden = false;
    musicPlayer.src = embedUrl;
    musicPlayer.title = trackArtist ? `${trackTitle} by ${trackArtist}` : trackTitle;
    musicNowPlaying.textContent = trackArtist ? `${trackTitle} by ${trackArtist}` : trackTitle;

    trackCards.forEach((card) => {
      const isActive = card === trackCard;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });
  };

  trackCards.forEach((trackCard) => {
    trackCard.setAttribute("aria-pressed", "false");
    trackCard.addEventListener("click", () => setActiveTrack(trackCard));
  });
}

const transitionVeil = document.createElement("div");
transitionVeil.className = "section-transition-veil";
document.body.appendChild(transitionVeil);

const verticalPages = Array.from(document.querySelectorAll("header, main > section"));
const transitionPauseMs = 500;
const transitionDurationMs = 420;
const wheelBlockMs = 150;
let activePageIndex = 0;
let isPageTransitioning = false;
let syncScrollFrame = 0;
let wheelBlockedUntil = 0;

function getNearestPageIndex() {
  const probePoint = window.scrollY + window.innerHeight * 0.35;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  verticalPages.forEach((page, index) => {
    const distance = Math.abs(page.offsetTop - probePoint);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function syncActivePageFromScroll() {
  if (isPageTransitioning) return;

  activePageIndex = getNearestPageIndex();
}

function clearTransitionClasses(page) {
  page.classList.remove(
    "page-transition-floating",
    "page-leave-up",
    "page-leave-down",
    "page-transition-hidden",
    "page-transition-enter-up",
    "page-transition-enter-down"
  );
  page.style.removeProperty("--page-width");
  page.style.removeProperty("--page-height");
  page.style.removeProperty("--page-left");
  page.style.removeProperty("--page-top");
}

function suppressAllPages(exceptPages = []) {
  verticalPages.forEach((page) => {
    if (exceptPages.includes(page)) {
      page.classList.remove("page-transition-hidden");
      return;
    }

    page.classList.add("page-transition-hidden");
  });
}

function restoreAllPages() {
  verticalPages.forEach((page) => {
    page.classList.remove("page-transition-hidden");
  });
}

function animatePageTransition(direction) {
  if (reduceMotion || isPageTransitioning) return;

  const nextIndex = activePageIndex + direction;

  if (nextIndex < 0 || nextIndex >= verticalPages.length) return;

  const currentPage = verticalPages[activePageIndex];
  const nextPage = verticalPages[nextIndex];
  const currentRect = currentPage.getBoundingClientRect();
  isPageTransitioning = true;
  document.body.classList.add("is-page-transitioning");
  transitionVeil.classList.add("is-visible");

  suppressAllPages([currentPage]);

  currentPage.classList.add("page-transition-floating", direction > 0 ? "page-leave-up" : "page-leave-down");
  currentPage.style.setProperty("--page-width", `${currentRect.width}px`);
  currentPage.style.setProperty("--page-height", `${currentRect.height}px`);
  currentPage.style.setProperty("--page-left", `${currentRect.left}px`);
  currentPage.style.setProperty("--page-top", `${currentRect.top}px`);

  nextPage.classList.add("page-transition-hidden");
  window.scrollTo({ top: nextPage.offsetTop, behavior: "auto" });

  window.setTimeout(() => {
    nextPage.classList.remove("page-transition-hidden");
    nextPage.classList.add(direction > 0 ? "page-transition-enter-up" : "page-transition-enter-down");

    window.setTimeout(() => {
      transitionVeil.classList.remove("is-visible");
      clearTransitionClasses(currentPage);
      clearTransitionClasses(nextPage);
      restoreAllPages();
      activePageIndex = nextIndex;
      isPageTransitioning = false;
      wheelBlockedUntil = Date.now() + wheelBlockMs;
      document.body.classList.remove("is-page-transitioning");
    }, transitionDurationMs);
  }, transitionPauseMs);
}

syncActivePageFromScroll();

window.addEventListener("scroll", () => {
  if (isPageTransitioning) return;

  window.cancelAnimationFrame(syncScrollFrame);
  syncScrollFrame = window.requestAnimationFrame(syncActivePageFromScroll);
});

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;

  const activeTag = document.activeElement && document.activeElement.tagName;

  if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) return;

  const isVerticalKey = ["ArrowDown", "PageDown", "Space"].includes(event.code) || ["ArrowUp", "PageUp"].includes(event.code);

  if (!isVerticalKey) return;

  if (event.code === "ArrowDown" || event.code === "PageDown" || event.code === "Space") {
    event.preventDefault();
    animatePageTransition(1);
    return;
  }

  if (event.code === "ArrowUp" || event.code === "PageUp") {
    event.preventDefault();
    animatePageTransition(-1);
  }
});

document.addEventListener(
  "wheel",
  (event) => {
    if (isPageTransitioning || Date.now() < wheelBlockedUntil) {
      event.preventDefault();
      return;
    }

    if (event.target.closest && event.target.closest(".memories-list")) return;

    const scrollingDown = event.deltaY > 0;
    const scrollingUp = event.deltaY < 0;

    if (scrollingDown) {
      event.preventDefault();
      animatePageTransition(1);
      return;
    }

    if (scrollingUp) {
      event.preventDefault();
      animatePageTransition(-1);
    }
  },
  { passive: false }
);

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
        return;
      }

      if (scrollingDown && currentMemoryIndex === maxIndex) {
        event.preventDefault();
        animatePageTransition(1);
        return;
      }

      if (scrollingUp && currentMemoryIndex === 0) {
        event.preventDefault();
        animatePageTransition(-1);
      }
    },
    { passive: false }
  );
}