// preloader
window.addEventListener('load', () => {
  const loader = document.getElementById('pre-loader');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 500);
});

// back tot top
var backToTopBtn = document.querySelector('.back-to-top');

window.onscroll = () => {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
};

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
sr.reveal('.skills__img', { delay: 600 });

/*SCROLL WORK*/
sr.reveal('.project-item', { interval: 300 });
sr.reveal('.btn-outline', { interval: 300 });
sr.reveal('.work__img', { interval: 200 });

/*SCROLL CONTACT*/
sr.reveal('.contact__input', { interval: 200 });

sr.reveal('.newsLetter', { delay: 200 });

// ---------------------------------------------------------------------------------------------

$(document).ready(function () {
  $('.menuIcon').click(function () {
    $('body').toggleClass('menuShown');
  });
});

$(document).ready(function () {
  $('menu a').on('click', function (event) {
    if (this.hash !== '') {
      event.preventDefault();

      var hash = this.hash;
      $('html, body').animate(
        {
          scrollTop: $(hash).offset().top,
        },
        1000,
        function () {
          window.location.hash = hash;
        }
      );
    }
  });
});

var section = $('#blog li, .faq li');

function toggleAccordion() {
  section.removeClass('active');
  $(this).addClass('active');
}

section.on('click', toggleAccordion);
