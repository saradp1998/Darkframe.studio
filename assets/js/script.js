
/* assets/js/script.js - lightweight JS for carousel, menu, filters and masonry sizing */
/* Menu toggle */
document.addEventListener('DOMContentLoaded', function(){
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu-overlay');
  hamburger.addEventListener('click', ()=> menu.classList.toggle('open'));

  /* Simple carousel */
  const slides = document.querySelectorAll('.hero-slide');
  let idx = 0;
  function showSlide(i){
    slides.forEach((s,si)=> s.style.opacity = si===i? '1' : '0');
  }
  if(slides.length>0){
    showSlide(0);
    setInterval(()=>{ idx = (idx+1)%slides.length; showSlide(idx); }, 4000);
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
