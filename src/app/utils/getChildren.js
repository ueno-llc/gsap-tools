import React from 'react';
import get from 'lodash/get';

const getDom = (item) => {
  const el = get(item, '_targets[0]');
  const tag = get(el, 'tagName');
  const id = get(el, 'id');
  const classes = get(el, 'className');

  const tagName = tag
    ? tag.toLowerCase()
    : '';

  const idName = id
    ? `#${get(el, 'id')}`
    : '';

  const className = classes && typeof classes === 'string'
    ? `.${classes.replace(' ', '.')}`
    : '';

  return <p><span>{tagName}</span><span>{idName}</span><span>{className}</span></p>;
};

const getProperties = (item) => {
  const css = get(item, 'vars.css');
  const vars = get(item, 'vars');

  let res;

  if (css) {
    res = Object.keys(css).join(', ');
  } else if (vars) {
    res = Object.keys(vars).join(', ');
  } else {
    res = '';
  }

  return res;
};

const getStart = item => item.timeline.startTime();
const getEnd = item => item.timeline.endTime();
const getDuration = item => item.timeline.totalDuration();

function getChildren(timeline) {
  const rows = [];

  const createSegment = item => ({
    target: getDom(item),
    start: getStart(item),
    end: getEnd(item),
    duration: getDuration(item),
    properties: getProperties(item),
  });

  const items = timeline.getChildren(true, true, false);

  items.forEach(item => rows.push({
    index: rows.length,
    data: createSegment(item),
  }));

  return rows;
}

export default getChildren;
