import type { Element } from 'hast';
import type { Processor, Transformer } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

export function lazyloadPlugin(this: Processor): Transformer {
  function visitor(el: Element) {
    if (el.tagName !== 'img') {
      return;
    }

    el.properties = {
      ...(el.properties || {}),
      loading: 'lazy',
    };
  }

  function transformer(htmlAST: Node): Node {
    visit(htmlAST, 'element', visitor);
    return htmlAST;
  }

  return transformer;
}
