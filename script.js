document.addEventListener('DOMContentLoaded',()=>{
  const menuBtn=document.querySelector('.menu-btn');
  const nav=document.querySelector('#nav');
  if(menuBtn&&nav){menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
  const year=document.querySelector('#year'); if(year) year.textContent=new Date().getFullYear();

  // Real construction photography used across the showcase.
  const photos={
    // Keep the first/hero image as requested.
    scaffold:'https://upload.wikimedia.org/wikipedia/commons/1/12/DFC_4040_Workers_in_safety_gear_assemble_a_large_steel_scaffold_against_a_clear_blue_sky.jpg',
    // India-based construction imagery for the remaining website visuals.
    scaffoldIndia:'https://upload.wikimedia.org/wikipedia/commons/7/79/Scaffolding_for_a_building_under_construction.jpg',
    hyderabadFormwork:'https://www.paschal.de/bilder/Newsartikel/bilder/Raster-Universalschalung-MyHomeAbhra-PASCHAL-Deck.jpg?m=1493289145',
    kolkataScaffold:'https://cdn.peri.cloud/.imaging/lPortrait/dam/b513d13b-baf6-44a2-9b72-7168e66a1514/7779/ss.jpg',
    indiaFormwork:'https://www.gujaratscaffolding.com/uploaded-files/thumb-cache/member_8/thumb---shuttering-material353.jpg',
    bangaloreFormwork:'https://cdn.peri.cloud/dam/jcr%3Accd17a7a-258f-4d7d-8e73-8fe201706ea8/5351/naganathapura-plant-bangalore.jpg?auto=webp&fit=bounds&format=pjpg&height=545&optimize=medium&width=970'
  };
  const setImage=(selector,src,alt)=>{const img=document.querySelector(selector);if(img){img.src=src;img.alt=alt;img.loading='lazy'}};
  setImage('.about-card img',photos.scaffoldIndia,'Indian construction site with steel scaffolding');
  setImage('.product-card-1 .product-image img',photos.scaffold,'Real steel scaffolding system with workers on site');
  setImage('.product-card-2 .product-image img',photos.hyderabadFormwork,'Formwork and adjustable support props at a Hyderabad construction project');
  setImage('.product-card-3 .product-image img',photos.indiaFormwork,'Adjustable steel props supporting slab shuttering in India');
  setImage('.product-card-4 .product-image img',photos.bangaloreFormwork,'Formwork installation at a Bangalore construction project');
  setImage('.product-card-5 .product-image img',photos.kolkataScaffold,'Indian construction scaffolding and support system');
  const p6=document.querySelector('.product-card-6 .product-image');
  if(p6&&!p6.querySelector('img')){p6.classList.remove('product-image-placeholder');const img=document.createElement('img');img.src=photos.hyderabadFormwork;img.alt='Formwork and support system at an Indian construction project';img.loading='lazy';p6.prepend(img)}
  const gallery=[photos.scaffold,photos.scaffoldIndia,photos.hyderabadFormwork,photos.kolkataScaffold];
  document.querySelectorAll('.gallery-item img').forEach((img,i)=>{if(gallery[i]){img.src=gallery[i];img.loading='lazy'}});
  const hero=document.querySelector('.hero'); if(hero) hero.style.backgroundImage='url("'+photos.scaffold+'")';
});
