const body=document.body,loader=()=>body.classList.add('loaded');window.addEventListener('load',()=>setTimeout(loader,450));document.getElementById('year').textContent=new Date().getFullYear();const nav=document.querySelector('.nav-wrap');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));const menuBtn=document.getElementById('menuBtn'),navLinks=document.getElementById('navLinks');menuBtn.onclick=()=>navLinks.classList.toggle('open');navLinks.querySelectorAll('a').forEach(a=>a.onclick=()=>navLinks.classList.remove('open'));const themeBtn=document.getElementById('themeBtn');themeBtn.onclick=()=>{body.classList.toggle('light');themeBtn.innerHTML=body.classList.contains('light')?"<i class='bx bx-sun'></i>":"<i class='bx bx-moon'></i>"};const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`});card.addEventListener('mouseleave',()=>card.style.transform='')});

// Thai / English language switcher
const languageButton = document.getElementById('langBtn');
const translations = window.I18N_TRANSLATIONS || {};
const applyLanguage = (language) => {
  const lang = language === 'th' ? 'th' : 'en';
  document.documentElement.lang = lang;
  document.body.classList.toggle('lang-th', lang === 'th');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[key]?.[lang] !== undefined) element.innerHTML = translations[key][lang];
  });
  document.title = translations['meta.title']?.[lang] || document.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && translations['meta.description']?.[lang]) description.content = translations['meta.description'][lang];
  if (languageButton) {
    languageButton.textContent = lang === 'en' ? 'TH' : 'EN';
    languageButton.setAttribute('aria-label', lang === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English');
    languageButton.title = lang === 'en' ? 'ภาษาไทย' : 'English';
  }
  localStorage.setItem('portfolio-language', lang);
  // Refill the year after translated footer HTML is rendered.
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
};
const savedLanguage = localStorage.getItem('portfolio-language') || 'en';
applyLanguage(savedLanguage);
if (languageButton) languageButton.addEventListener('click', () => applyLanguage(document.documentElement.lang === 'th' ? 'en' : 'th'));
