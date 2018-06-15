import { TweenLite } from 'gsap';

function clearProps(timeline) {
  const targets = timeline.getChildren();

  timeline.kill();

  targets.forEach((item) => {
    if (item.target) {
      TweenLite.set(item.target, { clearProps: 'all' });
    }
  });
}

export default clearProps;
