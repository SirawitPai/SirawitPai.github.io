const fs = require('fs');
const path = require('path');
const { ROOT, renderMarkup } = require('./helpers/page');

beforeAll(renderMarkup);
const all = (sel) => [...document.querySelectorAll(sel)];
const pageText = () => document.body.textContent.replace(/\s+/g, ' ');

describe('page content', () => {
  test('every local image and file it links to exists', () => {
    const refs = [
      ...all('img[src]').map((el) => el.getAttribute('src')),
      ...all('a[href]').map((el) => el.getAttribute('href')),
      ...all('link[href]').map((el) => el.getAttribute('href')),
    ].filter((ref) => !/^(https?:|mailto:|tel:|#)/.test(ref));
    const missing = refs.filter((ref) => !fs.existsSync(path.join(ROOT, ref)));
    expect(refs.length).toBeGreaterThan(10);
    expect(missing).toEqual([]);
  });

  test('every image has alt text', () => {
    expect(all('img').filter((img) => !img.getAttribute('alt'))).toEqual([]);
  });

  test('links that open a new tab use rel="noopener"', () => {
    const unsafe = all('a[target="_blank"]').filter((a) => !/noopener/.test(a.getAttribute('rel') || ''));
    expect(unsafe.map((a) => a.href)).toEqual([]);
  });

  test('every in-page link points to a real section', () => {
    const broken = all('a[href^="#"]').map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.querySelector(h));
    expect(broken).toEqual([]);
  });

  test('the CV can be downloaded in English and Thai, and the old resume is gone', () => {
    const downloads = all('a[download]').map((a) => a.getAttribute('href'));
    expect(downloads).toEqual(expect.arrayContaining(['assets/pdf/CV-SIRAWIT-EN.pdf', 'assets/pdf/CV-SIRAWIT-TH.pdf']));
    expect(downloads.filter((href) => /resume/i.test(href))).toEqual([]);
  });

  test('lists Jest and Postman as the main testing tools', () => {
    const qaSkills = all('[data-cat="qa"] .chips span').map((s) => s.textContent);
    expect(qaSkills.slice(0, 2)).toEqual(['Jest', 'Postman']);
  });

  test('includes everything from the CV', () => {
    const expected = [
      'KOS Design', 'Planet X Technology', 'Siam Commercial Bank',
      'Nakamoto Games', 'Nakamoto Admin', 'Outlanders', 'Monster Ville', 'Nakaverse',
      'Deal', 'GOGOJII Privilege', 'GOGOJII Maid Service', 'Company Landing Page', 'MDA',
      'React Context', 'Redux', 'Zustand', 'React Query', 'Tailwind CSS', 'Three.js',
      'Node.js (Express)', 'Golang', 'MongoDB', 'MySQL', 'Firebase',
      'Telegram Mini Apps', 'BotFather', 'LINE LIFF', 'Dialogflow', 'Vue / Nuxt', 'Jenkins', 'Figma',
      'ticket purchasing', 'daily quests', 'token staking', 'tournament system', 'end-to-end management',
      'Nov 2021 — 30 Sep 2026',
      'Jest', 'Postman', 'Cypress', 'Integration Testing', 'Regression Testing', 'UAT',
      'Flower Shop Chatbot Management System', 'Facebook Page Admin',
      "King Mongkut's University of Technology North Bangkok", '+66 91 108 6614',
    ];
    const text = pageText();
    expect(expected.filter((item) => !text.includes(item))).toEqual([]);
  });

  test('only lists skills that are on the CV', () => {
    const chips = all('#skillGroups .chips span').map((s) => s.textContent);
    const notOnCv = ['React Native', 'Flutter', 'PHP', 'Python', 'Java', 'Adobe XD', 'Photoshop', 'Illustrator', 'Jira', 'Newman'];
    expect(chips.filter((c) => notOnCv.includes(c))).toEqual([]);
  });

  test('applies for Full Stack Developer only', () => {
    expect(pageText()).not.toMatch(/Manual QA|QA Automation/);
  });
});
