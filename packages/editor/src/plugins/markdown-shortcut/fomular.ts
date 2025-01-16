import type { TextMatchTransformer } from '@lexical/markdown';
import { $createFormularNode, $isFormularNode, FormularNode } from '../formular/FormularNode';

export const formularTransformer: TextMatchTransformer = {
  dependencies: [FormularNode],
  export: (node) => {
    if (!$isFormularNode(node)) return null;

    const value = node.getValue();
    return '$' + (value ? value : '') + '$';
  },
  importRegExp: /\$([^$]*?)\$/,
  regExp: /\$([^$]*?)\$$/,
  replace: (textNode, match) => {
    const str = match[0];
    if (!str) return;
    const value = str.trim().replace(/^\$+/g, '').replace(/\$+$/g, '').trim();
    console.log(value, textNode);

    const formularNode = $createFormularNode({ value, isInsert: true, autoFocus: true });
    textNode.replace(formularNode);
  },
  trigger: '$',
  type: 'text-match',
};
