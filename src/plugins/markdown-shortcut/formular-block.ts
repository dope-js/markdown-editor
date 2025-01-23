import type { MultilineElementTransformer } from '@lexical/markdown';
import { $createFormularBlockNode, $isFormularBlockNode, FormularBlockNode } from '../formular-block/FormularBlockNode';

export const formularBlockTransform: MultilineElementTransformer = {
  dependencies: [FormularBlockNode],
  regExpStart: /^[ \t]*\$\$?/,
  regExpEnd: { regExp: /[ \t]*\$\$$/, optional: true },
  export(node) {
    if (!$isFormularBlockNode(node)) return null;

    const value = node.getValue();
    return '$$' + (value ? '\n' + value : '') + '\n' + '$$';
  },
  replace: (parentNode) => {
    const node = $createFormularBlockNode({ value: '' });
    parentNode.replace(node);
    setTimeout(() => node.select(), 80);
  },
  type: 'multiline-element',
};
