/* =====================================================================
   Small pure helpers shared by the page and the Jest tests.
   Works as a browser global (window.PortfolioUtils) and as a CommonJS module.
   ===================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PortfolioUtils = api;
})(typeof window !== 'undefined' ? window : null, () => {
  /** First month of full-time work at KOS Design (month is 1-based). */
  const CAREER_START = Object.freeze({ year: 2021, month: 11 });

  /** Whole years and months between a start month and `now`. Never negative. */
  const experienceSince = (start = CAREER_START, now = new Date()) => {
    const total = Math.max(0, (now.getFullYear() - start.year) * 12 + (now.getMonth() + 1 - start.month));
    return { years: Math.floor(total / 12), months: total % 12, totalMonths: total };
  };

  /** "4 years 11 months" / "4 ปี 11 เดือน" — months are dropped when zero. */
  const formatDuration = ({ years, months }, lang = 'en') => {
    if (lang === 'th') {
      const parts = [];
      if (years) parts.push(`${years} ปี`);
      if (months || !years) parts.push(`${months} เดือน`);
      return parts.join(' ');
    }
    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
    const parts = [];
    if (years) parts.push(plural(years, 'year'));
    if (months || !years) parts.push(plural(months, 'month'));
    return parts.join(' ');
  };

  /** Rounded years for short labels such as the "~5 years" badge. */
  const roundedYears = ({ years, months }) => years + (months >= 6 ? 1 : 0);

  /** Replace {{token}} placeholders; unknown tokens are left untouched. */
  const fillTokens = (text, tokens = {}) =>
    String(text).replace(/\{\{(\w+)\}\}/g, (match, key) => (key in tokens ? String(tokens[key]) : match));

  /** Translation lookup with an English fallback. */
  const translate = (translations, key, lang) => {
    const entry = translations && translations[key];
    if (!entry) return '';
    return entry[lang === 'th' ? 'th' : 'en'] ?? entry.en ?? '';
  };

  return { CAREER_START, experienceSince, formatDuration, roundedYears, fillTokens, translate };
});
