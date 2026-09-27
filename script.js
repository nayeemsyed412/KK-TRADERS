document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.querySelector('.menu-btn');
  const nav=document.querySelector('#nav');
  if(menuBtn&&nav){
    menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }

  const year=document.querySelector('#year');
  if(year) year.textContent=new Date().getFullYear();

  // Gallery category filter: show only the selected product group.
  const filters=document.querySelectorAll('.gallery-filter');
  const categories=document.querySelectorAll('.gallery-category[data-category]');
  const showCategory=(name)=>{
    filters.forEach(btn=>{
      const active=btn.dataset.filter===name;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-selected',active?'true':'false');
    });
    categories.forEach(category=>{
      category.classList.toggle('gallery-active',category.dataset.category===name);
    });
  };
  filters.forEach(btn=>btn.addEventListener('click',()=>showCategory(btn.dataset.filter)));
  if(filters.length) showCategory(filters[0].dataset.filter);

  // Keep the exact uploaded KK Steels logo in the About section.
  const logo=document.querySelector('.about-card.logo-card img');
  if(logo){
    logo.src='assets/kk-steels-exact.jpg?v=20260926-2';
    logo.alt='KK Steels exact uploaded logo';
  }

});
