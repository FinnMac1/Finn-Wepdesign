// Sections Animation
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));

// Smooth Scroll für Nav
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    const targetID = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetID);
    const navHeight = document.querySelector('nav').offsetHeight;
    const sectionTop = targetSection.offsetTop - navHeight - 10;
    window.scrollTo({ top: sectionTop, behavior:'smooth' });
  });
});

// Hamburger Menü
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});


// Canvas Resize
function resizeCanvas() {
  const bgCanvas = document.getElementById('background');
  const trailCanvas = document.getElementById('trail');
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // einmal beim Laden



// Cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e=>{
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

// Cursor-Trail
const trailCanvas = document.getElementById('trail');
const tCtx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

let trailPoints = [];
document.addEventListener('mousemove', e => {
  trailPoints.push({x:e.clientX,y:e.clientY,alpha:1});
  if(trailPoints.length>30) trailPoints.shift();
});

function animateTrail(){
  tCtx.clearRect(0,0,trailCanvas.width,trailCanvas.height);
  for(let i=1;i<trailPoints.length;i++){
    const p1 = trailPoints[i-1], p2 = trailPoints[i];
    tCtx.strokeStyle = `rgba(255,215,0,${p2.alpha})`;
    tCtx.lineWidth = 2;
    tCtx.beginPath();
    tCtx.moveTo(p1.x,p1.y);
    tCtx.lineTo(p2.x,p2.y);
    tCtx.stroke();
    p2.alpha -= 0.03;
  }
  trailPoints = trailPoints.filter(p=>p.alpha>0);
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Partikel-Hintergrund
const bgCanvas = document.getElementById('background');
const bgCtx = bgCanvas.getContext('2d');
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

let particles = [];
class Particle{
  constructor(){
    this.x=Math.random()*bgCanvas.width;
    this.y=Math.random()*bgCanvas.height;
    this.size=Math.random()*2+1;
    this.speedX=(Math.random()*0.2)-0.1;
    this.speedY=(Math.random()*0.2)-0.1;
  }
  update(){
    this.x+=this.speedX;
    this.y+=this.speedY;
    if(this.x<0||this.x>bgCanvas.width)this.speedX*=-1;
    if(this.y<0||this.y>bgCanvas.height)this.speedY*=-1;
  }
  draw(){
    bgCtx.fillStyle='#FFD700';
    bgCtx.beginPath();
    bgCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
    bgCtx.fill();
  }
}

function initParticles(){
  particles=[];
  for(let i=0;i<120;i++)particles.push(new Particle());
}

function connectParticles(){
  for(let a=0;a<particles.length;a++){
    for(let b=a;b<particles.length;b++){
      let dx=particles[a].x-particles[b].x;
      let dy=particles[a].y-particles[b].y;
      let distance=Math.sqrt(dx*dx+dy*dy);
      if(distance<100){
        bgCtx.strokeStyle='rgba(255,215,0,0.2)';
        bgCtx.lineWidth=1;
        bgCtx.beginPath();
        bgCtx.moveTo(particles[a].x,particles[a].y);
        bgCtx.lineTo(particles[b].x,particles[b].y);
        bgCtx.stroke();
      }
    }
  }
}

function animateParticles(){
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  particles.forEach(p=>{p.update();p.draw();});
  connectParticles();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Resize
window.addEventListener('resize', ()=>{
  bgCanvas.width=window.innerWidth;
  bgCanvas.height=window.innerHeight;
  trailCanvas.width=window.innerWidth;
  trailCanvas.height=window.innerHeight;
  initParticles();

});

