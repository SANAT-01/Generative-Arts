// ======================================================= Canvas for Color wheel creation ===========================================================================

const wheel = document.getElementById('color-picker');
const ctx_wheel = wheel.getContext('2d');
const centerX = wheel.width / 2;
const centerY = wheel.height / 2;
const radius = 80;
const innerRadius = 40;
let hue = 0;

function drawColorPicker() {
  for (let angle = 0; angle <= 360; angle++) {
    const startAngle = (angle - 2) * Math.PI / 180;
    const endAngle = angle * Math.PI / 180;
    const gradient = ctx_wheel.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, radius);
    gradient.addColorStop(0, `hsl(${angle}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
    ctx_wheel.beginPath();
    ctx_wheel.moveTo(centerX, centerY);
    ctx_wheel.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx_wheel.fillStyle = gradient;
    ctx_wheel.fill();
  }
}

drawColorPicker();

wheel.addEventListener('mousemove', (event) => {
  const rect = wheel.getBoundingClientRect();
  const x = event.clientX - rect.left - centerX;
  const y = event.clientY - rect.top - centerY;
  const distance = Math.sqrt(x * x + y * y);
  if (distance > innerRadius && distance <= radius) {
    const hue = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    wheel.style.cursor = 'crosshair';
    wheel.setAttribute('data-color', `hsl(${hue}, 100%, 50%)`);
  } else {
    wheel.style.cursor = 'default';
    wheel.removeAttribute('data-color');
  }
});

wheel.addEventListener('click', () => {
  const selectedColor = wheel.getAttribute('data-color');
  if (selectedColor) {
    console.log(selectedColor);
    hue = selectedColor;
  }
});

// =====================================================Canvas for Color generative digital art software creation ============================================================================================ 

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 1000;
particleArray = [];
let isMouseDown = false;
let sizes = 0.5;

const colorSlider = document.getElementById('size-slider');
colorSlider.addEventListener('input', function() {
  sizes = colorSlider.value;
  console.log(sizes);
});

window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = 1000;
});

const mouse = {
  x: null,
  y: null, 
}

canvas.addEventListener('mousedown', function(event){
  isMouseDown = true;
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 10; i++){
    particleArray.push(new Particle());
  }
});

canvas.addEventListener('mouseup', function(event){
  isMouseDown = false;
});

canvas.addEventListener('mousemove', function(event){
  if (isMouseDown) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 10; i++){
      particleArray.push(new Particle());
    }
  }
});

class Particle{
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = sizes;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = 'hsl(' + hue + ', 100%, 50%)';
  }
  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
  draw(){
    ctx.fillStyle = hue;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
  }
}

function handleParticle(){
  for (let i = 0; i < particleArray.length; i++){
    particleArray[i].update();
    particleArray[i].draw();
    if (particleArray[i].size <= 0.3){
      particleArray.splice(i, 1);
      i--;
    }
  }
}

function animate(){
  if (isMouseDown) {
    handleParticle();
  }
  requestAnimationFrame(animate);
}

animate();