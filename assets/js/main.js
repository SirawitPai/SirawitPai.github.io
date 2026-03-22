// preloader
window.addEventListener('load', () => {
  const loader = document.getElementById('pre-loader');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 500);
});

const langData = {
  en: {
    swap: 'Swap',
    pai: 'Pai',
    title: 'My Profile',
    hello: 'Hello 👋🏻',
    iam: "I'm Sirawit Pai",
    desc: 'Frontend Developer',
    detail_home:
      'This website showcases my work experience and provides detailed information about me. You can explore my projects and background through this page.',
    btn_contact: 'Contact',
    menu: 'Menu',
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    work: 'Work',
    contact: 'Contact',
    and: 'and',
    experience: 'Experience',
    jobTitle: 'Job Position of Interest',
    software_engineering: 'Software Engineer',
    fullStack_developer: 'Full Stack Developer',
    mobile_developer: 'Mobile Developer',
    my: 'My',
    me: 'Me',
    about_title: 'Hello, My Name is Sirawit Boonthong',
    about_detail: `Frontend developer with over 4 years of experience in building responsive and user-focused web applications. Highly responsible, fast learner, and adaptable to new technologies. Detail-oriented and committed to delivering high-quality work. Although quiet by nature, I work well in teams and maintain strong communication and collaboration skills.`,
    more: 'More',
    development: 'Development',
    database: 'Database',
    design: 'Design',
    ABOUT: 'ABOUT',
    kosdesign: 'KOSDESIGN',
    detail_kos: `We are a boutique agency with nearly 15 years of experience in website design. Since 2005, we have successfully launched more than 1,000 projects for clients worldwide.`,
    link: 'LINK',
    projects: 'PROJECTS',
    planet_x: 'PLANET-X',
    detail_planet_x: `We pay close attention to every step of the software development process to ensure a better user experience and high-quality software. Our clients can be confident that the final product will be reliable and fully functional.`,
    footer_text: 'Thank you for visiting my website.',
    contact_us: 'Contact Us',
    image: 'Images',
  },

  th: {
    swap: 'สลับ',
    pai: 'ปาย',
    title: 'โปรไฟล์ของฉัน',
    hello: 'สวัสดี 👋🏻',
    iam: 'ผมชื่อ ศิรวิทย์ ปาย',
    desc: 'นักพัฒนา Frontend',
    detail_home:
      'เว็บไซต์นี้จัดทำขึ้นเพื่อแสดงประสบการณ์การทำงานและข้อมูลเกี่ยวกับตัวผม คุณสามารถดูผลงานและประวัติได้ผ่านหน้าเว็บไซต์นี้',
    btn_contact: 'ติดต่อ',
    menu: 'เมนู',
    home: 'หน้าแรก',
    about: 'เกี่ยวกับ',
    skills: 'ทักษะ',
    work: 'ผลงาน',
    contact: 'ติดต่อ',
    and: 'และ',
    experience: 'ประสบการณ์',
    jobTitle: 'ตำแหน่งงานที่สนใจ',
    software_engineering: 'วิศวกรซอฟต์แวร์',
    fullStack_developer: 'นักพัฒนา Full Stack',
    mobile_developer: 'นักพัฒนา Mobile',
    my: 'ของฉัน',
    me: 'ฉัน',
    about_title: 'สวัสดี ผมชื่อ ศิรวิทย์ บุญทอง',
    about_detail: `นักพัฒนา Frontend ที่มีประสบการณ์มากกว่า 4 ปี เชี่ยวชาญในการสร้างเว็บไซต์ที่รองรับทุกอุปกรณ์และเน้นประสบการณ์ผู้ใช้ มีความรับผิดชอบสูง เรียนรู้เทคโนโลยีใหม่ได้รวดเร็ว ใส่ใจในรายละเอียด และมุ่งมั่นสร้างผลงานที่มีคุณภาพ แม้จะเป็นคนเงียบแต่สามารถทำงานร่วมกับทีมและสื่อสารได้อย่างมีประสิทธิภาพ`,
    more: 'เพิ่มเติม',
    development: 'การพัฒนา',
    database: 'ฐานข้อมูล',
    design: 'การออกแบบ',
    ABOUT: 'เกี่ยวกับ',
    kosdesign: 'KOSDESIGN',
    detail_kos: `เราเป็นเอเจนซี่ด้านการออกแบบเว็บไซต์ที่มีประสบการณ์เกือบ 15 ปี ตั้งแต่ปี 2005 เราได้สร้างผลงานมากกว่า 1,000 โปรเจกต์ให้กับลูกค้าทั่วโลก`,
    link: 'ลิงก์',
    projects: 'โปรเจกต์',
    planet_x: 'PLANET-X',
    detail_planet_x: `เราใส่ใจในทุกขั้นตอนของการพัฒนาซอฟต์แวร์ เพื่อให้ได้ทั้งประสบการณ์ผู้ใช้ที่ดีและซอฟต์แวร์คุณภาพสูง ลูกค้าจึงมั่นใจได้ว่างานที่ได้รับจะมีความเสถียรและใช้งานได้จริง`,
    footer_text: 'ขอบคุณที่เข้ามาเยี่ยมชมเว็บไซต์ของผม',
    contact_us: 'ติดต่อเรา',
    image: 'รูปภาพ',
  },

  cn: {
    swap: '切换',
    pai: '派',
    title: '我的个人简介',
    hello: '你好 👋🏻',
    iam: '我是 Sirawit Pai',
    desc: '前端开发工程师',
    detail_home:
      '本网站用于展示我的工作经验和个人信息，您可以在这里了解我的项目以及职业背景。',
    btn_contact: '联系',
    menu: '菜单',
    home: '首页',
    about: '关于我',
    skills: '技能',
    work: '作品',
    contact: '联系',
    and: '和',
    experience: '经验',
    jobTitle: '期望职位',
    software_engineering: '软件工程师',
    fullStack_developer: '全栈开发工程师',
    mobile_developer: '移动开发工程师',
    my: '我的',
    me: '我',
    about_title: '你好，我叫 Sirawit Boonthong',
    about_detail: `拥有超过4年前端开发经验，专注于构建响应式及以用户为中心的Web应用。学习能力强，责任心强，能够快速适应新技术。注重细节并致力于提供高质量成果。虽然性格较为安静，但具备良好的团队协作与沟通能力。`,
    more: '更多',
    development: '开发',
    database: '数据库',
    design: '设计',
    ABOUT: '关于',
    kosdesign: 'KOSDESIGN',
    detail_kos: `我们是一家拥有近15年网站设计经验的精品机构。自2005年以来，已为全球客户完成超过1000个项目。`,
    link: '链接',
    projects: '项目',
    planet_x: 'PLANET-X',
    detail_planet_x: `我们在软件开发的每个阶段都严格把控，以确保更好的用户体验和高质量产品。最终交付的成果将稳定可靠且功能完善。`,
    footer_text: '感谢您访问我的网站。',
    contact_us: '联系我们',
    image: '图片',
  },

  jp: {
    swap: '切り替え',
    pai: 'パイ',
    title: 'プロフィール',
    hello: 'こんにちは 👋🏻',
    iam: 'Sirawit Paiです',
    desc: 'フロントエンドエンジニア',
    detail_home:
      'このウェブサイトでは、私の職務経験やプロフィールを紹介しています。プロジェクトや経歴の詳細をご覧いただけます。',
    btn_contact: 'お問い合わせ',
    menu: 'メニュー',
    home: 'ホーム',
    about: '自己紹介',
    skills: 'スキル',
    work: '実績',
    contact: '連絡先',
    and: 'と',
    experience: '経験',
    jobTitle: '希望職種',
    software_engineering: 'ソフトウェアエンジニア',
    fullStack_developer: 'フルスタック開発者',
    mobile_developer: 'モバイル開発者',
    my: '私の',
    me: '私',
    about_title: 'はじめまして、Sirawit Boonthongです',
    about_detail: `4年以上の経験を持つフロントエンドエンジニアで、レスポンシブかつユーザー中心のWebアプリ開発を得意としています。責任感が強く、新しい技術にも素早く対応できます。細部までこだわり、高品質な成果物の提供を大切にしています。静かな性格ですが、チームでの協力やコミュニケーションも大切にしています。`,
    more: 'もっと見る',
    development: '開発',
    database: 'データベース',
    design: 'デザイン',
    ABOUT: '概要',
    kosdesign: 'KOSDESIGN',
    detail_kos: `私たちは約15年のWebデザイン経験を持つブティックエージェンシーです。2005年以降、世界中のクライアントに1000以上のプロジェクトを提供してきました。`,
    link: 'リンク',
    projects: 'プロジェクト',
    planet_x: 'PLANET-X',
    detail_planet_x: `ソフトウェア開発の各工程に細心の注意を払い、優れたユーザー体験と高品質な製品を提供しています。最終成果物は信頼性が高く、完全に機能します。`,
    footer_text: 'ご覧いただきありがとうございます。',
    contact_us: 'お問い合わせ',
    image: '画像',
  },
};
const langSelector = document.getElementById('language');

function setLanguage(lang) {
  localStorage.setItem('lang', lang);

  document.querySelectorAll('[data-lang]').forEach((el) => {
    const key = el.getAttribute('data-lang');

    el.textContent = langData[lang][key];
  });
}

langSelector.addEventListener('change', () => {
  setLanguage(langSelector.value);
});

const toggleBtn = document.getElementById('themeToggle');

function updateIcon() {
  const isDark = document.documentElement.classList.contains('dark');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
}

toggleBtn.onclick = () => {
  document.documentElement.classList.toggle('dark');

  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  updateIcon();
};

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

updateIcon();
/* -----------------------
DARK MODE
----------------------- */

const themeBtn = document.getElementById('themeToggle');

function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  localStorage.setItem('theme', mode);
}

themeBtn.addEventListener('click', () => {
  if (document.body.classList.contains('dark')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

/* -----------------------
LOAD SETTINGS
----------------------- */

window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  const savedTheme = localStorage.getItem('theme') || 'light';

  langSelector.value = savedLang;
  setLanguage(savedLang);

  setTheme(savedTheme);
});
/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }
};
showMenu('nav-toggle', 'nav-menu');
/*===== ACTIVE AND REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
  /*Active link*/
  navLink.forEach((n) => n.classList.remove('active'));
  this.classList.add('active');

  /*Remove menu mobile*/
  const navMenu = document.getElementById('nav-menu');
  navMenu.classList.remove('show');
}
navLink.forEach((n) => n.addEventListener('click', linkAction));

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '80px',
  duration: 2000,
  reset: false,
});

/*SCROLL HOME*/
sr.reveal('.home__title', {});
sr.reveal('.button', { delay: 200 });
sr.reveal('.home__img', { delay: 400 }); //  , origin: 'left'  'right' , 'bottom'
sr.reveal('.ppot', { delay: 200 });
sr.reveal('.home__social-icon', { interval: 200 });

/*SCROLL ABOUT*/
sr.reveal('.about__img', { delay: 400, origin: 'left' });
sr.reveal('.about-col-left', { delay: 200, origin: 'left' });
sr.reveal('.about-col-right', { delay: 200, origin: 'right' });
sr.reveal('.about-btn-blk', { delay: 200 });
sr.reveal('.title-kos', { delay: 200 });
sr.reveal('.about__subtitle', { delay: 200 });
sr.reveal('.about__text', { delay: 200 });

sr.reveal('.title', { delay: 200 });
sr.reveal('.card', { delay: 250 });
sr.reveal('.card2', { delay: 200 });

/*SCROLL SKILLS*/

sr.reveal('.skills__subtitle', {});
sr.reveal('.skills__text', {});
sr.reveal('.skills__data', { interval: 200 });
sr.reveal('.skills__name', { interval: 200 });
sr.reveal('.skills__img1', { delay: 600 });
sr.reveal('.skills__img2', { delay: 700 });
sr.reveal('.skills__img3', { delay: 800 });
sr.reveal('.skills__img4', { delay: 900 });
sr.reveal('.skills__img5', { delay: 1000 });
sr.reveal('.skills__img6', { delay: 1100 });
sr.reveal('.skills__img7', { delay: 1200 });
sr.reveal('.skills__img8', { delay: 1300 });
sr.reveal('.skills__img9', { delay: 1400 });

/*SCROLL WORK*/
sr.reveal('.project-item', { interval: 300 });
sr.reveal('.btn-outline', { interval: 300 });
sr.reveal('.work__img', { interval: 200 });

/*SCROLL CONTACT*/
sr.reveal('.contact__input', { interval: 200 });

sr.reveal('.newsLetter', { delay: 200 });

const btn = document.getElementById('musicToggle');
const player = document.getElementById('ytPlayer');

let isMuted = true;

// toggle sound
btn.addEventListener('click', () => {
  if (isMuted) {
    player.src =
      'https://www.youtube.com/embed/PuVO9fow2iI?autoplay=1&mute=0&loop=1&playlist=PuVO9fow2iI';
    btn.textContent = '🔊';
  } else {
    player.src =
      'https://www.youtube.com/embed/PuVO9fow2iI?autoplay=1&mute=1&loop=1&playlist=PuVO9fow2iI';
    btn.textContent = '🔇';
  }

  isMuted = !isMuted;
});
