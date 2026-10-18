const { read, renderMarkup } = require('./helpers/page');

global.window.I18N_TRANSLATIONS = undefined;
require('../assets/js/i18n-data.js');
const translations = window.I18N_TRANSLATIONS;

const html = read('index.html');
const usedKeys = [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]))];
const JS_ONLY_KEYS = ['meta.title', 'meta.description', 'contact.copied'];
// short labels that are written the same way in both languages
const SAME_IN_BOTH = ['nav.qa', 'qa.f3.d'];

const tagsOf = (s) => [...s.matchAll(/<\s*([a-z]+)/gi)].map((m) => m[1].toLowerCase()).filter((t) => t !== 'span').sort();
const visibleText = (s) => {
  const div = document.createElement('div');
  div.innerHTML = s;
  return div.textContent.replace(/\s+/g, ' ').trim();
};

describe('translations', () => {
  test('every data-i18n key has EN and TH text', () => {
    const missing = usedKeys.filter((k) => !translations[k] || !translations[k].en || !translations[k].th);
    expect(missing).toEqual([]);
  });

  test('has no unused keys', () => {
    const unused = Object.keys(translations).filter((k) => !usedKeys.includes(k) && !JS_ONLY_KEYS.includes(k));
    expect(unused).toEqual([]);
  });

  test('Thai text is actually translated', () => {
    const notThai = Object.entries(translations)
      .filter(([k]) => !SAME_IN_BOTH.includes(k))
      .filter(([, v]) => !/[฀-๿]/.test(v.th) && v.th === v.en)
      .map(([k]) => k);
    expect(notThai).toEqual([]);
  });

  test('keeps the same HTML tags in both languages', () => {
    const mismatched = Object.entries(translations)
      .filter(([, v]) => tagsOf(v.en).join() !== tagsOf(v.th).join())
      .map(([k]) => k);
    expect(mismatched).toEqual([]);
  });

  test('English copy matches the text written in index.html', () => {
    renderMarkup();
    const drift = [...document.querySelectorAll('[data-i18n]')]
      .filter((el) => visibleText(el.innerHTML) !== visibleText(translations[el.dataset.i18n].en))
      .map((el) => el.dataset.i18n);
    expect(drift).toEqual([]);
  });

  test('Thai copy avoids stiff, machine-translated phrases', () => {
    const stiff = ['ให้มัน', 'ส่งมอบ', 'มีชีวิตชีวา', 'ระดับ production', 'แข็งแรงที่สุด', 'ผสาน'];
    const found = Object.entries(translations)
      .flatMap(([k, v]) => stiff.filter((p) => v.th.includes(p)).map((p) => `${k}: ${p}`));
    expect(found).toEqual([]);
  });
});
