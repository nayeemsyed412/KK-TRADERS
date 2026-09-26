document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.querySelector('.menu-btn');
  const nav=document.querySelector('#nav');
  if(menuBtn&&nav){menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
  const year=document.querySelector('#year'); if(year) year.textContent=new Date().getFullYear();

  // Real construction photography used across the showcase.
  const photos={
    scaffold:'https://upload.wikimedia.org/wikipedia/commons/1/12/DFC_4040_Workers_in_safety_gear_assemble_a_large_steel_scaffold_against_a_clear_blue_sky.jpg',
    scaffoldIndia:'https://upload.wikimedia.org/wikipedia/commons/7/79/Scaffolding_for_a_building_under_construction.jpg',
    acrow:'https://upload.wikimedia.org/wikipedia/commons/0/06/Acrow_props_support_failing_building_at_Armadale_station.jpg',
    acrowSingle:'https://upload.wikimedia.org/wikipedia/commons/9/92/Acrow_prop.jpg',
    formwork:'https://upload.wikimedia.org/wikipedia/commons/4/46/Special_Formwork.jpg',
    coupler:'https://upload.wikimedia.org/wikipedia/commons/5/5d/Coupler_1.jpg',
    siteFormwork:'https://upload.wikimedia.org/wikipedia/commons/1/1f/Formwork_for_construction_01.jpg'
  };
  const setImage=(selector,src,alt)=>{const img=document.querySelector(selector);if(img){img.src=src;img.alt=alt;img.loading='lazy'}};
  setImage('.about-card img',photos.scaffoldIndia,'Real steel scaffolding at a building construction site');
  setImage('.product-card-1 .product-image img',photos.scaffold,'Real steel scaffolding system with workers on site');
  setImage('.product-card-2 .product-image img',photos.acrow,'Real Acrow support props used at a construction site');
  setImage('.product-card-3 .product-image img',photos.acrowSingle,'Real Acrow telescopic support prop');
  setImage('.product-card-4 .product-image img',photos.formwork,'Real steel column formwork during construction');
  setImage('.product-card-5 .product-image img',photos.coupler,'Real scaffolding coupler connection');
  const p6=document.querySelector('.product-card-6 .product-image');
  if(p6&&!p6.querySelector('img')){p6.classList.remove('product-image-placeholder');const img=document.createElement('img');img.src=photos.siteFormwork;img.alt='Real construction formwork and reinforcement work';img.loading='lazy';p6.prepend(img)}
  const gallery=[photos.scaffold,photos.acrow,photos.formwork,photos.coupler];
  document.querySelectorAll('.gallery-item img').forEach((img,i)=>{if(gallery[i]){img.src=gallery[i];img.loading='lazy'}});
  const hero=document.querySelector('.hero'); if(hero) hero.style.backgroundImage='url("'+photos.scaffold+'")';
});
