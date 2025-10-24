
/* assets/js/script.js - lightweight JS for carousel, menu, filters and masonry sizing */
/* Menu toggle */
document.addEventListener('DOMContentLoaded', function(){


  /* Simple carousel */
  const slides = document.querySelectorAll('.hero-slide');
  let idx = 0;

  function showSlide(i) {
    slides.forEach((s, si) => s.classList.toggle('show', si === i));
  }

  if (slides.length > 0) {
    showSlide(0);
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      showSlide(idx);
    }, 4000);
  }

  /* Filters */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.grid-item');
  filterButtons.forEach(btn=> btn.addEventListener('click', function(){
    filterButtons.forEach(b=> b.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.type;
    items.forEach(it=>{
      if(type==='all' || it.dataset.type===type) it.style.display = '';
      else it.style.display = 'none';
    });
    // after toggling display, recalc masonry
    resizeAllGridItems();
  }));

  /* Mailto contact form in footer */
  const contactForm = document.getElementById('footer-contact');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const to = document.getElementById('contact-email').value || '';
      const name = document.getElementById('contact-name').value || '';
      const message = document.getElementById('contact-message').value || '';
      const subject = encodeURIComponent('Website contact from ' + name);
      const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + to + ')');
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  /* Masonry-like grid: set row spans based on image height */
  function resizeGridItem(item){
    const grid = document.querySelector('.grid');
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('gap'));
    const img = item.querySelector('img');
    const contentH = img.getBoundingClientRect().height + item.querySelector('.grid-caption').getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentH + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
  }
  function resizeAllGridItems(){
    const allItems = document.querySelectorAll('.grid-item');
    allItems.forEach(it => resizeGridItem(it));
  }
  window.addEventListener('load', resizeAllGridItems);
  window.addEventListener('resize', resizeAllGridItems);

  /* Click on grid item -> navigate to project page */
  document.querySelectorAll('.grid-item').forEach(g=>{
    g.addEventListener('click', ()=>{
      const slug = g.dataset.slug;
      if(slug) window.location.href = slug;
    });
  });
});

// Activar filtro desde URL
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get('filter'); // exteriors, interiors, competitions
  if(filter){
    const btn = document.querySelector(`.filter-btn[data-type="${filter}"]`);
    if(btn) btn.click();
  }
});

// LIGHTBOX con galerías por proyecto (usa data-gallery si existe)
document.addEventListener("DOMContentLoaded", () => {
  const gridItems = document.querySelectorAll(".grid-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox() {
    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // evita scroll detrás del lightbox
  }
  function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // restaurar scroll
  }

  function showImage(index) {
    if (!currentGallery.length) return;
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    currentIndex = index;
    lightboxImg.src = currentGallery[index];
    openLightbox();
  }

  gridItems.forEach((item) => {
    const img = item.querySelector("img");
    // Si se añadió data-gallery, usarlo; si no, usar solo la imagen principal
    const galleryData = item.dataset.gallery;
    const galleryImages = galleryData
      ? galleryData.split(",").map(s => s.trim())
      : [img.src];

    img.addEventListener("click", (e) => {
      e.preventDefault();
      currentGallery = galleryImages;
      showImage(0);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    // cerrar si se clickea el fondo (no el contenido)
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
  nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    }
  });
});
