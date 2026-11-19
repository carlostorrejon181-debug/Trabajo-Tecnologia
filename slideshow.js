



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

// Cada ficha admite más fotos agregando imágenes dentro de .foto.
document.querySelectorAll(".ficha .foto").forEach((gallery) => {
  const photos = Array.from(gallery.querySelectorAll("img"));
  if (photos.length < 2) return;

  let index = 0;
  let request = 0;
  gallery.classList.add("foto-galeria");
  gallery.setAttribute("role", "region");
  gallery.setAttribute("aria-roledescription", "carrusel");
  const name = gallery.closest(".ficha").querySelector("h2").textContent;
  gallery.setAttribute("aria-label", `Fotografías: ${name}`);
  const counter = document.createElement("span");
  counter.className = "foto-contador";
  counter.setAttribute("role", "status");
  counter.setAttribute("aria-atomic", "true");
  gallery.append(counter);

  function render() {
    photos.forEach((photo, i) => {
      photo.classList.toggle("foto-activa", i === index);
      photo.setAttribute("aria-hidden", String(i !== index));
    });
    counter.textContent = `${index + 1} / ${photos.length}`;
  }

  async function move(offset) {
    const ticket = ++request;
    const next = (index + offset + photos.length) % photos.length;
    const photo = photos[next];
    // Conservar la foto actual hasta que la siguiente esté lista.
    try {
      await photo.decode();
    } catch {
      if (ticket === request) counter.textContent = "No se pudo cargar la foto";
      return;
    }
    if (ticket !== request) return;
    index = next;
    render();
  }

  [-1, 1].forEach((offset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `foto-flecha ${offset < 0 ? "foto-anterior" : "foto-siguiente"}`;
    button.setAttribute("aria-label", offset < 0 ? "Foto anterior" : "Foto siguiente");
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${offset < 0 ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    button.addEventListener("click", () => move(offset));
    gallery.append(button);
  });
  gallery.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  });
  render();
  photos.forEach((photo) => {
    photo.hidden = false;
    photo.loading = "eager";
  });
});

