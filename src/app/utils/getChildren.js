import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isElement from 'lodash/isElement';
import isEmpty from 'lodash/isEmpty';

const getSelector = (item) => {
  let res = '';

  const targets = get(item, '_targets');
  const el = targets && targets.length === 1 ? targets[0] : get(item, 'target');
  const isNode = elm => NodeList.prototype.isPrototypeOf(elm); // eslint-disable-line
  const tag = elm => get(elm, 'tagName');

  if (isNode(el)) {
    const dom = Array.from(el).map(elm => tag(elm)).join(', ');

    res = `[${dom}]`;
  } else if (isArray(el)) {
    const dom = [];

    el.forEach((elm) => {
      if (isNode(elm)) {
        dom.unshift(`NodeList(${elm.length})`);
      } else if (tag(elm)) {
        dom.push(tag(elm).toLowerCase());
      }
    });

    res = `[${dom.join(', ')}]`;
  } else if (isElement(el)) {
    if (tag(el)) {
      res = tag(el).toLowerCase();
    } else {
      res = '';
    }
  } else {
    res = '';
  }

  const id = get(el, 'id');
  const classes = get(el, 'className');
  const tagName = res || '';

  const idName = id
    ? `#${get(el, 'id')}`
    : '';

  const className = classes && typeof classes === 'string'
    ? `.${classes.replace(' ', '.')}`
    : '';

  const hasNoSelector = isEmpty(tagName) && isEmpty(idName) && isEmpty(classes);

  if (hasNoSelector) {
    return [];
  }

  return [tagName, idName, className];
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

const getStart = (item, offset = 0) => {
  const startTime = item.timeline.startTime();

  return offset === startTime ? startTime : startTime + offset;
};

const getDuration = item => item.timeline.totalDuration();

const createRows = (arr, res, offset = 0) => arr
  .forEach(t => res.push({
    target: getSelector(t),
    start: getStart(t, offset),
    duration: getDuration(t),
    properties: getProperties(t),
    isSet: t.duration() === 0,
  }));

function getChildren(timeline) {
  if (!timeline || isEmpty(timeline) || timeline.data.isTween) {
    return [];
  }

  const rows = [];
  const parent = timeline.getChildren(false, false, true);
  const hasParent = !isEmpty(parent);

  if (hasParent) {
    parent.forEach((t) => {
      const offset = t.startTime();
      const children = t.getChildren(true, true, false);

      createRows(children, rows, offset);
    });
  } else {
    const items = timeline.getChildren(true, true, false);

    createRows(items, rows);
  }

  return rows;
}

export default getChildren;
