function clearProps(timeline) {
  const targets = timeline.getChildren();

  timeline.kill();

  targets.forEach(item => {
    if (item.target) {
      console.log('-item.target', item.target)
      return TweenMax.set('.appleGuy', { clearProps: 'all' });
      // return TweenMax.set(item.target, { clearProps: 'all' });
    }
  });
}

export default clearProps;
