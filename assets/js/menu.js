// Opens and closes the menu on small screens.
var toggle = document.querySelector('.menu-toggle');
var nav = document.getElementById('site-nav');
toggle.addEventListener('click', function () {
  var open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
