const main = document.querySelector('main');
const samsung = document.querySelector('.samsung');
const bottom = document.querySelector('.bottom');
const title = document.querySelectorAll('.title span');
const shopNow = document.querySelector('.shop-now');
const subtext = document.querySelector('.shop-now + p');
const white = document.querySelector('.white');

const slide = document.querySelector('.slide');
const navigation = document.querySelector('.navigation');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const count = document.querySelector('.count-slide');

const slideContainer = document.querySelector('.slides');
const slides = gsap.utils.toArray('.desc');
const loop = horizontalLoop(slides, { paused: true });
let autoplayDelay = 4000; // Час автоперемикання (мс)
let autoplay = null; // Змінна для інтервалу автоперемикання
let isUserInteracted = false; // Чи було взаємодію з користувачем

let currentPosition = 1;
const tl = gsap.timeline();

document.addEventListener('DOMContentLoaded', (event) => {
  gsap.registerPlugin(
    Flip,
    ScrollTrigger,
    Observer,
    ScrollToPlugin,
    Draggable,
    MotionPathPlugin,
    EaselPlugin,
    PixiPlugin,
    TextPlugin
  );
  gsap.from(bottom, { x: -400, duration: 2 });
  gsap.from(samsung, { x: -400, duration: 2 });
  gsap.to(samsung, { y: -40, delay: 2, duration: 1 });
  tl.from(title, {
    x: '-50vw',
    delay: 3,
    duration: 2,
    opacity: 0,
    stagger: 0.3,
  });
  tl.to(bottom, { opacity: 0, duration: 1 });
  tl.set(bottom, { display: 'none' });
  tl.from(white, { x: '-100%', duration: 2 });
  tl.to(slideContainer, { opacity: 1, duration: 2 });
  tl.to(title, { y: 40, duration: 1 }, '-=100%');
  tl.to(
    main,
    {
      backgroundSize: '90%',
      backgroundPosition: '400px 67%',
      duration: 2,
    },
    '-=100%'
  ).add(function () {
    startAutoplay();
  });
  tl.to([slide, navigation], {
    opacity: 1,
    duration: 1,
  });
  tl.to([shopNow, subtext], { opacity: 1, duration: 2 });
  tl.to(shopNow, {
    scale: 1.1,
    repeat: -1,
    ease: 'expo.out',
    yoyoEase: 'expo.out',
  });
  // Функція для запуску автоперемикання
  function startAutoplay() {
    if (!isUserInteracted) {
      autoplay = setInterval(() => {
        if (currentPosition >= 5) {
          currentPosition = 1;
        } else {
          currentPosition += 1;
        }
        count.innerHTML = currentPosition;
        gsap.to(main, {
          backgroundImage: `url(./assets/images/frame${Math.floor(
            currentPosition
          )}.png)`,
          backgroundSize: 'contain',
          backgroundPosition: 'center right',
        });
        loop.next({ duration: 0.5, ease: 'power1.inOut' });
      }, autoplayDelay);
    }
  }
  // Функція для зупинки автоперемикання
  function stopAutoplay() {
    clearInterval(autoplay);
    autoplay = null;
  }
  prevBtn.addEventListener('click', () => {
    stopAutoplay();
    loop.previous({ duration: 0.5, ease: 'power1.inOut' });
    isUserInteracted = true;
    if (currentPosition <= 1) {
      currentPosition = 5;
    } else {
      currentPosition -= 1;
    }
    count.innerHTML = currentPosition;
    gsap.to(main, {
      backgroundImage: `url(./assets/images/frame${Math.floor(
        currentPosition
      )}.png)`,
    });
  });
  nextBtn.addEventListener('click', () => {
    stopAutoplay();
    loop.next({ duration: 0.5, ease: 'power1.inOut' });
    isUserInteracted = true;
    if (currentPosition >= 5) {
      currentPosition = 1;
    } else {
      currentPosition += 1;
    }
    count.innerHTML = currentPosition;
    gsap.to(main, {
      backgroundImage: `url(./assets/images/frame${Math.floor(
        currentPosition
      )}.png)`,
    });
  });
});

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: 'none' },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  gsap.set(items, {
    // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px')));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
          gsap.getProperty(el, 'xPercent')
      );
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], 'scaleX') +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add('label' + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}
