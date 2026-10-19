const { loadPage, flushPromises, text } = require('./helpers/page');

const utils = () => window.PortfolioUtils;

describe('page behaviour', () => {
  test('renders English by default and fills every {{token}}', () => {
    loadPage();
    expect(document.documentElement.lang).toBe('en');
    const visible = document.body.cloneNode(true);
    visible.querySelectorAll('script').forEach((s) => s.remove());
    expect(visible.innerHTML).not.toMatch(/\{\{\w+\}\}/);
    expect(document.title).toBe('Sirawit Boonthong — Full Stack Developer');
  });

  test('shows the experience calculated from the start date', () => {
    loadPage();
    const exp = utils().experienceSince();
    expect(text('[data-exp="years"]')).toBe(String(exp.years));
    expect(text('[data-exp="months"]')).toBe(String(exp.months));
    expect(text('[data-i18n="roles.fs.pitch"]')).toContain(utils().formatDuration(exp, 'en'));
  });

  test('switches the page to Thai and back', () => {
    loadPage();
    const btn = document.getElementById('langBtn');
    btn.click();
    expect(document.documentElement.lang).toBe('th');
    expect(document.body.classList.contains('lang-th')).toBe(true);
    expect(text('[data-i18n="nav.about"]')).toBe('เกี่ยวกับผม');
    expect(text('[data-i18n="fact.sinceValue"]')).toContain(utils().formatDuration(utils().experienceSince(), 'th'));
    expect(btn.textContent).toBe('EN');
    expect(window.localStorage.getItem('portfolio-language')).toBe('th');

    btn.click();
    expect(document.documentElement.lang).toBe('en');
    expect(text('[data-i18n="nav.about"]')).toBe('About');
  });

  test('the nav CV button downloads the CV in the page language', () => {
    loadPage();
    const cv = document.querySelector('[data-cv-auto]');
    expect(cv.getAttribute('href')).toBe('assets/pdf/CV-SIRAWIT-EN.pdf');
    document.getElementById('langBtn').click();
    expect(cv.getAttribute('href')).toBe('assets/pdf/CV-SIRAWIT-TH.pdf');
  });

  test('remembers the chosen language on the next visit', () => {
    loadPage({ lang: 'th' });
    expect(document.documentElement.lang).toBe('th');
    expect(document.title).toContain('ศิรวิทย์');
  });

  test('toggles the light theme and remembers it', () => {
    loadPage();
    document.getElementById('themeBtn').click();
    expect(document.body.classList.contains('light')).toBe(true);
    expect(window.localStorage.getItem('portfolio-theme')).toBe('light');
    loadPage({ theme: 'light' });
    expect(document.body.classList.contains('light')).toBe(true);
  });

  test('opens and closes the mobile menu', () => {
    loadPage();
    const menuBtn = document.getElementById('menuBtn');
    const links = document.getElementById('navLinks');
    menuBtn.click();
    expect(links.classList.contains('open')).toBe(true);
    expect(menuBtn.getAttribute('aria-expanded')).toBe('true');
    links.querySelector('a').click();
    expect(links.classList.contains('open')).toBe(false);
    expect(menuBtn.getAttribute('aria-expanded')).toBe('false');
  });

  test('copies the email and shows a toast', async () => {
    loadPage();
    document.getElementById('copyEmail').click();
    await flushPromises();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('sirawitpai0@gmail.com');
    expect(text('#toast')).toBe('✓ Email copied to clipboard');
    expect(document.getElementById('toast').classList.contains('show')).toBe(true);
  });

  test('skill tabs highlight one category', () => {
    loadPage();
    document.querySelector('.skill-tab[data-filter="qa"]').click();
    const groups = [...document.querySelectorAll('#skillGroups .skill-group')];
    expect(groups.filter((g) => !g.classList.contains('dim')).map((g) => g.dataset.cat)).toEqual(['qa']);
    const qaTags = [...document.querySelectorAll('#tagSphere span.hot')].map((t) => t.textContent);
    expect(qaTags).toEqual(expect.arrayContaining(['Jest', 'Postman']));
  });

  test('the QA terminal replays the Jest and Postman runs', () => {
    loadPage();
    const terminal = text('#termBody');
    expect(terminal).toContain('npm test');
    expect(terminal).toContain('npm run test:api');
    expect(text('#termCount')).toBe('10 / 10 passing');
  });
});
