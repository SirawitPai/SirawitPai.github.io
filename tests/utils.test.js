const {
  CAREER_START, CAREER_END, experienceSince, formatDuration, roundedYears, fillTokens, translate,
} = require('../assets/js/utils');

describe('experienceSince', () => {
  test('calculates experience from Nov 2021 to the end of Sep 2026', () => {
    expect(CAREER_START).toEqual({ year: 2021, month: 11 });
    expect(CAREER_END).toEqual({ year: 2026, month: 10 });
    expect(experienceSince(CAREER_START, new Date(2024, 10, 18))).toEqual({ years: 3, months: 0, totalMonths: 36 });
    expect(experienceSince(CAREER_START, new Date(2026, 9, 18))).toEqual({ years: 4, months: 11, totalMonths: 59 });
  });

  test('stops counting after the last day at KOS Design', () => {
    expect(experienceSince(CAREER_START, new Date(2027, 5, 1))).toEqual({ years: 4, months: 11, totalMonths: 59 });
    expect(experienceSince(CAREER_START, new Date(2027, 5, 1), null).totalMonths).toBe(67);
  });

  test('never returns a negative duration', () => {
    expect(experienceSince(CAREER_START, new Date(2020, 0, 1))).toEqual({ years: 0, months: 0, totalMonths: 0 });
  });

  test('defaults to today', () => {
    expect(experienceSince().totalMonths).toBe(experienceSince(CAREER_START, new Date()).totalMonths);
  });
});

describe('formatDuration', () => {
  test('formats the duration in English and Thai', () => {
    expect(formatDuration({ years: 4, months: 11 }, 'en')).toBe('4 years 11 months');
    expect(formatDuration({ years: 4, months: 11 }, 'th')).toBe('4 ปี 11 เดือน');
  });

  test('uses singular words and drops zero months', () => {
    expect(formatDuration({ years: 1, months: 1 }, 'en')).toBe('1 year 1 month');
    expect(formatDuration({ years: 5, months: 0 }, 'en')).toBe('5 years');
    expect(formatDuration({ years: 5, months: 0 }, 'th')).toBe('5 ปี');
    expect(formatDuration({ years: 0, months: 3 }, 'th')).toBe('3 เดือน');
  });

  test('rounds to the nearest year for short labels', () => {
    expect(roundedYears({ years: 4, months: 11 })).toBe(5);
    expect(roundedYears({ years: 4, months: 5 })).toBe(4);
  });
});

describe('fillTokens and translate', () => {
  test('fills {{tokens}} and leaves unknown ones untouched', () => {
    expect(fillTokens('{{exp}} of work, {{missing}}', { exp: '4 years' })).toBe('4 years of work, {{missing}}');
    expect(fillTokens('no tokens')).toBe('no tokens');
  });

  test('looks up a translation and falls back to English', () => {
    const dict = { hi: { en: 'Hello', th: 'สวัสดี' }, only: { en: 'English only' } };
    expect(translate(dict, 'hi', 'th')).toBe('สวัสดี');
    expect(translate(dict, 'hi', 'fr')).toBe('Hello');
    expect(translate(dict, 'only', 'th')).toBe('English only');
    expect(translate(dict, 'nope', 'en')).toBe('');
  });
});
