if (typeof window === 'undefined') {
  module.exports = {};
} else if (typeof window.TweenLite === 'undefined') {
  // possibly import gsap here?
  console.error('Missing TweenLite');
} else {
  module.exports = {
    TweenLite: window.TweenLite,
    TweenMax: window.TweenMax,
    TimelineLite: window.TimelineLite,
    TimelineMax: window.TimelineMax,
  };
}
