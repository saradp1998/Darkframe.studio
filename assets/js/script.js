
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
  const galleryEl   = document.getElementById("gallery");
  const lightbox    = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn    = document.getElementById("lightboxClose");
  const prevBtn     = document.getElementById("prev");
  const nextBtn     = document.getElementById("next");

  let currentGallery = [];
  let currentIndex   = 0;

  function openLightbox() {
    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showImage(index) {
    if (!currentGallery.length) return;
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;
    currentIndex = index;
    lightboxImg.src = currentGallery[index];
    openLightbox();
  }

  // ✅ This now works — delegated click on ANY .grid-item
  if (galleryEl) {
    galleryEl.addEventListener("click", (e) => {
      const item = e.target.closest(".grid-item");
      if (!item || !galleryEl.contains(item)) return;

      const galleryData = item.dataset.gallery?.trim();
      const fallbackImg = item.querySelector("img");
      let galleryImages = [];

      if (galleryData) {
        galleryImages = galleryData
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
          .map(s => encodeURI(s)); // supports spaces in filenames
      } else if (fallbackImg?.src) {
        galleryImages = [fallbackImg.src];
      }

      if (galleryImages.length > 0) {
        currentGallery = galleryImages;
        showImage(0);
        e.preventDefault(); // avoid default link behavior
        return;
      }

      // Optional: fallback navigation via data-slug (if used)
      const slug = item.dataset.slug;
      if (slug) window.location.href = slug;
    });
  }

  // Lightbox controls
  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
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
