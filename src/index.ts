import './style.css';
import {
  TimelineLite,
  CSSPlugin,
  AttrPlugin,
  Power0,
  Circ,
  Bounce,
  Elastic,
  BezierPlugin
} from 'gsap/all';
const plugins = [CSSPlugin, AttrPlugin, BezierPlugin];

let sun = document.getElementById('sun');
let sky = document.getElementById('sky');
let smoke = document.getElementById('smoke');
let moon = document.getElementById('moon');
let cabinWindow = document.getElementById('window');
let windowLight = '#FFCDAA';
let windowDark = '#280b0b';
let daySkyColor = '#7689A9';
let nightSkyColor = '#051838';
let slider = document.querySelector('.slider');
let meter = document.querySelector('.meter');
let svg = document.querySelector('svg');
let tl = new TimelineLite({
  onComplete: function() {
    this.restart();
  }
});

const duration = 4;

tl.to(svg, 0, { visibility: 'visible' });
tl.to(meter, duration, { width: '100%', ease: Power0.easeNone }, 0);
tl.to(
  moon,
  (1 / 7) * duration,
  {
    y: -45,
    ease: Elastic.easeIn.config(1.75, 0.75)
  },
  0
);
tl.to(
  moon,
  (1 / 7) * duration,
  { y: 0, ease: Bounce.easeOut },
  (5 / 7) * duration
);

tl.add('start', 0);
tl.add('dawn', (1 / 7) * duration);

tl.to(
  sun,
  (4 / 7) * duration,
  {
    bezier: { type: 'thru', values: [{ x: 100, y: -55 }, { x: 300, y: 0 }] },
    ease: Circ.easeIn
  },
  'dawn'
);

tl.to(cabinWindow, (4 / 7) * duration, { fill: windowLight }, 'dawn');
tl.to(
  cabinWindow,
  (1 / 14) * duration,
  { fill: windowDark },
  (4 / 7) * duration
);

tl.to(
  smoke,
  (2 / 7) * duration,
  { y: -60, rotate: 360, repeat: 3, opacity: 1 },
  'dawn'
);

tl.to(sky, (3 / 7) * duration, { fill: daySkyColor }, 0);
tl.to(sky, (1 / 7) * duration, { fill: nightSkyColor }, (4 / 7) * duration);

const fasterButton = document.getElementById('faster');
const slowerButton = document.getElementById('slower');

let speed = 1;
fasterButton.addEventListener('click', () => {
  speed = speed * 2;
  tl.timeScale(speed);
});

slowerButton.addEventListener('click', () => {
  speed = speed / 2;
  tl.timeScale(speed);
});

// slider logic

const dragger = document.querySelector('dragger');
const scale = slider.clientWidth;
let dragging = false;

// function detectMovement(event: MouseEvent) {
//   const x = event.movementX;
//   let current = meter.clientWidth;
//   let newWidth = current + x;
//   tl.progress(newWidth / scale);
// }

// function stopDrag(event: MouseEvent) {
//   dragging = false;
//   window.removeEventListener('mousemove', detectMovement);
//   window.removeEventListener('mouseup', stopDrag);
// }

// dragger.addEventListener('mousedown', function drag(event) {
//   if (!dragging) {
//     window.addEventListener('mousemove', detectMovement);
//     window.addEventListener('mouseup', stopDrag);
//     dragging = true;
//   }
// });
