import type { MultilineElementTransformer } from '@lexical/markdown';
import { CODE } from '@lexical/markdown';
import { $createCodeBlockNode, CodeBlockNode } from '../codeblock';

export const codeTransformerCopy: MultilineElementTransformer = {
  ...CODE,
  dependencies: [CodeBlockNode],
  replace: (parentNode, _children, match) => {
    const codeBlockNode = $createCodeBlockNode({ code: '', language: match[1] ?? '', meta: '' });
    parentNode.replace(codeBlockNode);
    setTimeout(() => {
      codeBlockNode.select();
    }, 80);
  },
};
