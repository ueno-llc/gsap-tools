import React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isElement from 'lodash/isElement';

const getDom = (item) => {
  let res = '';

  const targets = get(item, '_targets');
  const el = targets && targets.length === 1 ? targets[0] : get(item, 'target');
  const isNode = el => NodeList.prototype.isPrototypeOf(el);
  const tag = el => get(el, 'tagName');

  if (isNode(el)) {
    const dom = Array.from(el).map(item => tag(item)).join(', ');

    res = `[${dom}]`;
  } else if (isArray(el)) {
    let dom = [];

    el.forEach(item => {
      if (isNode(item)) {
        dom.unshift(`NodeList(${item.length})`);
      } else {
        dom.push(tag(item).toLowerCase());
      }
    });

    res = `[${dom.join(', ')}]`;
  } else if (isElement(el)) {
    res = tag(el).toLowerCase();
  } else {
    res = '';
  }

  const id = get(el, 'id');
  const classes = get(el, 'className');

  const tagName = res
    ? res
    : '';

  const idName = id
    ? `#${get(el, 'id')}`
    : '';

  const className = classes && typeof classes === 'string'
    ? `.${classes.replace(' ', '.')}`
    : '';

  return <p>&nbsp;<span>{tagName}</span><span>{idName}</span><span>{className}</span></p>;
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
const getDuration = item => item.timeline.totalDuration();

function getChildren(timeline) {
  const rows = [];

  const createSegment = item => ({
    target: getDom(item),
    start: getStart(item),
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
