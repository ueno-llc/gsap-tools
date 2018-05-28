const colors = {
  white: '#ffffff',
  char: '#D8DEE9',
  comment: '#999999',
  keyword: '#c5a5c5',
  primitive: '#5a9bcf',
  string: '#8dc891',
  variable: '#d7deea',
  boolean: '#ff8b50',
  punctuation: '#5FB3B3',
  tag: '#fc929e',
  function: '#79b6f2',
  className: '#FAC863',
  operator: '#fc929e',
};

export default {
  'code[class*="language-"]': {
    'color': colors.white,
    'fontFamily': 'Inconsolata, Monaco, Consolas, Courier New, Courier, monospace',
    'direction': 'ltr',
    'textAlign': 'left',
    'whiteSpace': 'pre',
    'wordSpacing': 'normal',
    'wordBreak': 'normal',
    'lineHeight': '1.75',
    'MozTabSize': '4',
    'OTabSize': '4',
    'tabSize': '4',
    'WebkitHyphens': 'none',
    'MozHyphens': 'none',
    'msHyphens': 'none',
    'hyphens': 'none',
  },
  'pre[class*="language-"]': {
    'color': colors.white,
    'fontFamily': 'Inconsolata, Monaco, Consolas, Courier New, Courier, monospace',
    'direction': 'ltr',
    'textAlign': 'left',
    'whiteSpace': 'pre',
    'wordSpacing': 'normal',
    'wordBreak': 'normal',
    'lineHeight': '1.5',
    'MozTabSize': '4',
    'OTabSize': '4',
    'tabSize': '4',
    'WebkitHyphens': 'none',
    'MozHyphens': 'none',
    'msHyphens': 'none',
    'hyphens': 'none',
    'padding': '1.6em',
    'overflow': 'auto',
    'borderRadius': '0.3em',
    'background': '#282c34',
  },
  ':not(pre) > code[class*="language-"]': {
    'background': '#282c34',
    'padding': '.1em',
    'borderRadius': '.3em',
  },
  'comment': {
    'color': colors.comment,
  },
  'block-comment': {
    'color': colors.comment,
  },
  'prolog': {
    'color': colors.comment,
  },
  'doctype': {
    'color': colors.comment,
  },
  'cdata': {
    'color': colors.comment,
  },
  'punctuation': {
    'color': colors.punctuation,
  },
  'namespace': {
    'opacity': '.7',
  },
  'keyword': {
    'color': colors.keyword,
  },
  'tag': {
    'color': colors.tag,
  },
  'class-name': {
    'color': colors.className,
  },
  'atrule': {
    'color': colors.className,
  },
  'boolean': {
    'color': colors.boolean,
  },
  'property': {
    'color': colors.primitive,
  },
  'function-name': {
    'color': colors.primitive,
  },
  'constant': {
    'color': colors.primitive,
  },
  'symbol': {
    'color': colors.primitive,
  },
  'deleted': {
    'color': colors.primitive,
  },
  'number': {
    'color': colors.primitive,
  },
  'selector': {
    'color': colors.char,
  },
  'attr-name': {
    'color': colors.keyword,
  },
  'string': {
    'color': colors.string,
  },
  'attr-value': {
    'color': colors.string,
  },
  'char': {
    'color': colors.char,
  },
  'builtin': {
    'color': colors.char,
  },
  'inserted': {
    'color': colors.char,
  },
  'variable': {
    'color': colors.variable,
  },
  'operator': {
    'color': colors.punctuation,
  },
  'entity': {
    'color': colors.variable,
    'cursor': 'help',
  },
  'url': {
    'color': colors.variable,
  },
  '.language-css .token.string': {
    'color': '#87C38A',
  },
  '.style .token.string': {
    'color': '#87C38A',
  },
  'function': {
    'color': colors.function,
  },
  'regex': {
    'color': '#E9C062',
  },
  'important': {
    'color': '#fd971f',
    'fontWeight': 'bold',
  },
  'bold': {
    'fontWeight': 'bold',
  },
  'italic': {
    'fontStyle': 'italic',
  },
}
