function outdent(str) {
  let indentation;
  let lines = str.split('\n');

  if (lines[0] === '') {
    lines.shift();
  }

  const matches = /^[\s\t]+/.exec(lines[0]);

  if (matches) {
    [indentation] = matches;
  }

  if (indentation) {
    lines = lines.map(l => l.replace(indentation, '').replace(/\t/g, '    '));
  }

  return indentation ? lines.join('\n').trim() : str;
}

export default outdent;
