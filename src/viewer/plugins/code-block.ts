import type { Code } from 'mdast';
import type { Transformer } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

function getPropsValue(value: unknown): string | number | boolean | undefined {
  if (typeof value === 'undefined') return true;
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const number = parseInt(value);
    if (!isNaN(number) && number.toString() === value) return number;
    return value;
  }

  return undefined;
}

export function codeBlock(): Transformer {
  function transformer(ast: Node) {
    visit(ast, 'code', (node: Node) => {
      const { value, lang, meta } = node as Code;

      const propStrs = (meta?.trim() || '').split(/\s+/);
      const props = propStrs.reduce(
        (acc, curr) => {
          const arr = curr.split('=');
          if (arr.length === 0) return acc;
          if (!arr[0].trim()) return acc;

          const propValue = getPropsValue(arr[1]);
          if (propValue === undefined) return acc;

          acc[arr[0]] = propValue;
          return acc;
        },
        {} as Record<string, string | number | boolean>
      );

      node.type = 'CodeBlock';
      node.data = { hName: 'CodeBlock', hProperties: { lang, code: value, ...props } };
    });

    return ast;
  }

  return transformer;
}
