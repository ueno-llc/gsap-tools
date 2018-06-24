import store from 'store';

// If an id was stored in localstorage, all animations was paused after
// begin registered. We need then, to resume the one selected, and we need
// to check if the selected one is a timeline containing childs timelines too.
function resumeAnimations(timeline) {
  if (!store.hasId || timeline.data.isTween) {
    return;
  }

  timeline.play();

  return timeline.getChildren(false, false, true).forEach((tween) => {
    if (!tween) {
      return;
    }

    tween.play();
  });
}

export default resumeAnimations;
