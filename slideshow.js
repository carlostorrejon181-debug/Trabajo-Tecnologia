



let slideIndex = 1;
let slideTimer;

function plusSlides(offset) {
  showSlides(slideIndex + offset);
}

function currentSlide(index) {
  showSlides(index);
}

function showSlides(index) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  clearTimeout(slideTimer);
  if (!slides.length) return;

  slideIndex = ((index - 1) % slides.length + slides.length) % slides.length + 1;
  for (let i = 0; i < slides.length; i++) {
    const active = i === slideIndex - 1;
    slides[i].classList.toggle("is-active", active);
    slides[i].setAttribute("aria-hidden", String(!active));
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("active", i === slideIndex - 1);
    dots[i].setAttribute("aria-pressed", String(i === slideIndex - 1));
  }
  slideTimer = setTimeout(function () {
    plusSlides(1);
  }, 2000);
}

showSlides(slideIndex);

