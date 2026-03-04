// theme.js
// Sample the logo image to generate a primary color and set CSS variables dynamically.
(function(){
  const img = document.getElementById('logo');
  if(!img) return;

  function rgbToHex(r,g,b){
    return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }

  function getContrastColor(r,g,b){
    // relative luminance
    const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
    return lum > 0.55 ? '#111111' : '#ffffff';
  }

  function averageColorFromImage(image, step=4){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width = Math.min(200, image.naturalWidth || 200);
    const h = canvas.height = Math.min(200, image.naturalHeight || 200);
    ctx.drawImage(image,0,0,w,h);
    const data = ctx.getImageData(0,0,w,h).data;
    let r=0,g=0,b=0,count=0;
    for(let i=0;i<data.length;i+=4*step){
      r += data[i]; g += data[i+1]; b += data[i+2]; count++;
    }
    return count? [Math.round(r/count), Math.round(g/count), Math.round(b/count)]:[34,34,34];
  }

  function setTheme(){
    try{
      const [r,g,b] = averageColorFromImage(img,6);
      const primary = rgbToHex(r,g,b);
      const contrast = getContrastColor(r,g,b);
      // compute a warm accent by shifting slightly (blend with golden)
      const accent = '#e0a84a';
      document.documentElement.style.setProperty('--primary', primary);
      document.documentElement.style.setProperty('--text', contrast);
      document.documentElement.style.setProperty('--accent', accent);
    }catch(e){
      // fail silently, keep defaults
      console.warn('theme.js: could not sample logo', e);
    }
  }

  if(img.complete){ setTheme(); }
  else img.addEventListener('load', setTheme);
})();

(function(){
  const nav = document.querySelector('.site-nav');
  if(!nav) return;
  
  let lastScrollY = 0;
  const SCROLL_THRESHOLD = 80; // pixels to scroll before nav reacts
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDiff = Math.abs(currentScrollY - lastScrollY);
    
    // Only react if scrolled more than threshold
    if(scrollDiff >= SCROLL_THRESHOLD){
      if(currentScrollY > lastScrollY){
        // scrolling down
        nav.classList.add('hidden');
      } else {
        // scrolling up
        nav.classList.remove('hidden');
      }
      
      lastScrollY = currentScrollY;
    }
  });
})();
