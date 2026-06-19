/* ─────────────────────────────────────────────────
   KOHWEIREN-site · main.js
───────────────────────────────────────────────── */

const GITHUB_USER = 'stephenkwr';

/* ── Nav: scroll state ──────────────────────────── */
const nav  = document.getElementById('nav');
const hero = document.getElementById('hero');

function syncNav() {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}
window.addEventListener('scroll', syncNav, { passive: true });
syncNav();

/* ── Nav: mobile toggle ─────────────────────────── */
const toggle    = document.querySelector('.nav__toggle');
const mobileNav = document.getElementById('nav-mobile');

function closeMobileNav() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  mobileNav.setAttribute('hidden', '');
}

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) {
    mobileNav.removeAttribute('hidden');
  } else {
    mobileNav.setAttribute('hidden', '');
  }
});

mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

document.addEventListener('click', e => {
  if (!nav.contains(e.target) && nav.classList.contains('is-open')) closeMobileNav();
});

/* ── Reveal animations ──────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.section__heading, .about__text, .skills__groups, .cards-grid, .contact__intro, .contact__links'
).forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

/* ── GitHub Repos ────────────────────────────────── */
const LANG_COLORS = {
  JavaScript:       '#f1e05a',
  TypeScript:       '#3178c6',
  Python:           '#3572a5',
  Java:             '#b07219',
  'C++':            '#f34b7d',
  C:                '#555555',
  HTML:             '#e34c26',
  CSS:              '#563d7c',
  Shell:            '#89e051',
  Go:               '#00add8',
  Rust:             '#dea584',
  Ruby:             '#701516',
  Kotlin:           '#7f52ff',
  Dart:             '#00b4ab',
  'Jupyter Notebook': '#da5b0b',
};

function esc(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function buildCard(repo) {
  const article = document.createElement('article');
  article.className = 'card reveal';

  const color    = LANG_COLORS[repo.language] || '#94a3b8';
  const langHtml = repo.language
    ? `<span class="card__lang">
         <span class="card__lang-dot" style="background:${color}" aria-hidden="true"></span>
         ${esc(repo.language)}
       </span>`
    : '';

  article.innerHTML = `
    <div class="card__header">
      <h3 class="card__title">${esc(repo.name)}</h3>
    </div>
    <p class="card__desc">${repo.description ? esc(repo.description) : '<em>No description</em>'}</p>
    <div class="card__meta">
      ${langHtml}
      <span class="card__stars">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .587l3.668 7.568L24 9.306l-6 5.849 1.416 8.258L12 18.897l-7.416 4.516L6 15.155 0 9.306l8.332-1.151z"/>
        </svg>
        ${repo.stargazers_count}
      </span>
    </div>
    <a class="card__link" href="${esc(repo.html_url)}" target="_blank" rel="noopener noreferrer">
      View on GitHub ↗
    </a>
  `;
  return article;
}

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos = await res.json();

    grid.innerHTML = '';

    if (!Array.isArray(repos) || repos.length === 0) {
      grid.innerHTML = '<p class="state-msg">No public repositories yet.</p>';
      return;
    }

    repos.forEach(repo => {
      const card = buildCard(repo);
      grid.appendChild(card);
      revealObs.observe(card);
    });
  } catch {
    grid.innerHTML = `
      <p class="state-msg">
        Couldn't load repositories.
        <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer"
           style="color:var(--accent)">View on GitHub ↗</a>
      </p>
    `;
  }
}

loadRepos();
