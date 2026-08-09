"use strict";

document.documentElement.classList.remove("no-js");

const GITHUB_USER = "stephenkwr";
const REPO_EXCLUSIONS = new Set([
  "aiops",
  "engineeringimagecomparison",
  "image_comparison",
  "kohweiren-site",
]);

const LANGUAGE_COLORS = {
  Python: "#52d5d0",
  Kotlin: "#a97bff",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
  C: "#8e99a5",
  "C#": "#7fd15a",
  HTML: "#e34c26",
  CSS: "#c7ff63",
  Shell: "#89e051",
};

const REPO_SUMMARIES = {
  HoleInTheWall: "Android 3D pose-matching game built in Kotlin with SceneView.",
  Predictor: "Data pipeline and forecasting system for Singapore carpark availability.",
  Image_conversion: "Python utility for converting between common raster image formats.",
  Dictionary: "Spanish-English dictionary utility built in Python.",
  "finance-automation-dashboard": "Dashboard for automating financial indicator calculations.",
  CANoe_automation: "Python RPA workflow for CANoe audio measurement automation.",
  Weather: "Singapore weather reporting utility built in Python.",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.getElementById("nav");
const navToggle = document.querySelector(".nav__toggle");
const mobileMenu = document.getElementById("mobile-menu");

function setMenu(open) {
  nav.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileMenu.toggleAttribute("hidden", !open);
}

navToggle.addEventListener("click", () => {
  setMenu(navToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

function syncNav() {
  nav.classList.toggle("scrolled", window.scrollY > 36);
}

window.addEventListener("scroll", syncNav, { passive: true });
syncNav();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -48px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (!reduceMotion) element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
  revealObserver.observe(element);
});

const navLinks = [...document.querySelectorAll('.nav__desktop a[href^="#"]')];
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-25% 0px -60%", threshold: [0, 0.2, 0.6] },
);

trackedSections.forEach((section) => sectionObserver.observe(section));

function animateCount(element) {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target) || reduceMotion) return;

  const duration = 900;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 },
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const heroImage = document.querySelector(".hero__media img");
let parallaxQueued = false;

function updateParallax() {
  const shift = Math.min(window.scrollY * 0.07, 52);
  heroImage.style.transform = `translate3d(0, ${shift}px, 0) scale(1.04)`;
  parallaxQueued = false;
}

if (!reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      if (parallaxQueued) return;
      parallaxQueued = true;
      requestAnimationFrame(updateParallax);
    },
    { passive: true },
  );
}

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (reduceMotion || window.innerWidth <= 900) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${-y * 1.3}deg) rotateY(${x * 1.3}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

function initSignalCanvas() {
  const canvas = document.getElementById("signal-canvas");
  const context = canvas.getContext("2d");
  if (!context) return;

  let width = 0;
  let height = 0;
  let points = [];
  let animationFrame = 0;
  let lastTime = 0;

  function buildPoints() {
    const count = width < 640 ? 20 : Math.min(48, Math.round(width / 34));
    points = Array.from({ length: count }, (_, index) => ({
      x: (index * 97) % width,
      y: (index * 61 + 37) % height,
      vx: ((index % 5) - 2) * 0.035,
      vy: (((index * 3) % 5) - 2) * 0.03,
      radius: index % 7 === 0 ? 2 : 1,
    }));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildPoints();
    if (reduceMotion) draw(0);
  }

  function draw(time) {
    const delta = Math.min(32, time - lastTime || 16);
    lastTime = time;
    context.clearRect(0, 0, width, height);

    points.forEach((point) => {
      if (!reduceMotion) {
        point.x += point.vx * delta;
        point.y += point.vy * delta;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
      }
    });

    for (let first = 0; first < points.length; first += 1) {
      for (let second = first + 1; second < points.length; second += 1) {
        const dx = points[first].x - points[second].x;
        const dy = points[first].y - points[second].y;
        const distance = Math.hypot(dx, dy);
        if (distance > 145) continue;
        context.strokeStyle = `rgba(199, 255, 99, ${0.12 * (1 - distance / 145)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(points[first].x, points[first].y);
        context.lineTo(points[second].x, points[second].y);
        context.stroke();
      }
    }

    points.forEach((point, index) => {
      context.fillStyle = index % 9 === 0 ? "rgba(82, 213, 208, 0.75)" : "rgba(199, 255, 99, 0.5)";
      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();
    });

    if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  document.addEventListener("visibilitychange", () => {
    if (reduceMotion) return;
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(draw);
    }
  });

  resize();
  if (!reduceMotion) animationFrame = requestAnimationFrame(draw);
}

initSignalCanvas();

function createRepoCard(repo, index) {
  const link = document.createElement("a");
  link.className = "repo-card reveal";
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${repo.name} on GitHub`);

  const top = document.createElement("div");
  top.className = "repo-card__top";

  const number = document.createElement("span");
  number.className = "repo-card__index";
  number.textContent = String(index + 1).padStart(2, "0");

  const arrow = document.createElement("span");
  arrow.className = "repo-card__arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "\u2197";

  top.append(number, arrow);

  const title = document.createElement("h3");
  title.textContent = repo.name;

  const description = document.createElement("p");
  description.className = "repo-card__description";
  description.textContent = REPO_SUMMARIES[repo.name] || repo.description || "Public repository on GitHub.";

  const footer = document.createElement("div");
  footer.className = "repo-card__footer";

  if (repo.language) {
    const language = document.createElement("span");
    language.className = "repo-card__language";
    const dot = document.createElement("i");
    dot.setAttribute("aria-hidden", "true");
    dot.style.setProperty("--language-color", LANGUAGE_COLORS[repo.language] || "#96a29b");
    language.append(dot, document.createTextNode(repo.language));
    footer.append(language);
  }

  const stars = document.createElement("span");
  stars.textContent = `${repo.stargazers_count} star${repo.stargazers_count === 1 ? "" : "s"}`;
  footer.append(stars);

  link.append(top, title, description, footer);
  return link;
}

function showRepoState(grid, message, includeLink = false) {
  const state = document.createElement("p");
  state.className = "repo-state";
  state.append(document.createTextNode(message));

  if (includeLink) {
    state.append(document.createTextNode(" "));
    const link = document.createElement("a");
    link.href = `https://github.com/${GITHUB_USER}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open GitHub instead";
    state.append(link);
  }

  grid.replaceChildren(state);
  grid.setAttribute("aria-busy", "false");
}

async function loadRepositories() {
  const grid = document.getElementById("repos-grid");

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const repositories = await response.json();
    const visibleRepositories = Array.isArray(repositories)
      ? repositories
          .filter((repo) => !repo.fork && !repo.archived)
          .filter((repo) => !REPO_EXCLUSIONS.has(repo.name.toLowerCase()))
          .slice(0, 6)
      : [];

    if (visibleRepositories.length === 0) {
      showRepoState(grid, "No public repositories to show right now.");
      return;
    }

    grid.replaceChildren();
    visibleRepositories.forEach((repo, index) => {
      const card = createRepoCard(repo, index);
      grid.append(card);
      revealObserver.observe(card);
      requestAnimationFrame(() => card.classList.add("is-visible"));
    });
    grid.setAttribute("aria-busy", "false");
  } catch (error) {
    showRepoState(grid, "The GitHub feed is unavailable.", true);
  }
}

loadRepositories();
