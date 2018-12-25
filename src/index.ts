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
const plugins: object[] = [CSSPlugin, AttrPlugin, BezierPlugin];

let sun: Element = document.getElementById('sun');
let sky: Element = document.getElementById('sky');
let smoke: Element = document.getElementById('smoke');
let moon: Element = document.getElementById('moon');
let cabinWindow: Element = document.getElementById('window');
let windowLight: string = '#FFCDAA';
let windowDark: string = '#280b0b';
let daySkyColor: string = '#7689A9';
let nightSkyColor: string = '#051838';
let slider: Element = document.querySelector('.slider');
let meter: Element = document.querySelector('.meter');
let svg: Element = document.querySelector('svg');
let tl: TimelineLite = new TimelineLite({
  onComplete: function() {
    this.restart();
  }
});

const duration: number = 4;

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
  { y: -60, rotation: 30, transformOrigin: '50% 50%', repeat: 2, opacity: 1 },
  'dawn'
);

tl.to(sky, (3 / 7) * duration, { fill: daySkyColor }, 0);
tl.to(sky, (1 / 7) * duration, { fill: nightSkyColor }, (4 / 7) * duration);

const fasterButton: Element = document.getElementById('faster');
const slowerButton: Element = document.getElementById('slower');

let speed: number = 1;
fasterButton.addEventListener('click', () => {
  speed = speed * 2;
  tl.timeScale(speed);
});

slowerButton.addEventListener('click', () => {
  speed = speed / 2;
  tl.timeScale(speed);
});

// slider logic
const container: Element = document.querySelector('.container');
const dragger: Element = document.querySelector('.dragger');
const scale: number = slider.clientWidth;
let dragging: boolean = false;

function detectMovement(event: PointerEvent) {
  if (dragging) {
    console.log('detecting movement', event.movementX);
    const x: number = event.movementX;
    let current: number = meter.clientWidth;
    let newWidth: number = current + x;
    console.log('progress', newWidth / scale);
    tl.progress(newWidth / scale).pause();
  }
}
container.addEventListener('pointermove', detectMovement);

function stopDrag(event: PointerEvent) {
  if (dragging) {
    console.log('stop drag');
    dragging = false;
    tl.play();
    (container as HTMLElement).style.setProperty('touch-action', 'auto');
  }
}
container.addEventListener('pointerup', stopDrag);

let noClickSlider: boolean = false;
dragger.addEventListener('pointerdown', function drag(event) {
  if (!dragging) {
    tl.pause();
    (container as HTMLElement).style.setProperty('touch-action', 'none');
    dragging = true;
    noClickSlider = true;
    event.stopPropagation();
  }
});

function sliderClick(event: PointerEvent) {
  if (!noClickSlider) {
    console.log('click');
    const target = event.offsetX / scale;
    console.log(target);
    tl.progress(target);
  } else {
    noClickSlider = false;
  }
}
slider.addEventListener('click', sliderClick);
