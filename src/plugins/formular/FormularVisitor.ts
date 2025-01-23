import type { LexicalExportVisitor } from '@/utils';
import type { InlineMath } from 'mdast-util-math';
import type { FormularNode } from './FormularNode';
import { $isFormularNode } from './FormularNode';

export const FormularVisitor: LexicalExportVisitor<FormularNode, InlineMath> = {
  testLexicalNode: $isFormularNode,
  visitLexicalNode: ({ lexicalNode, actions }) => {
    actions.addAndStepInto('inlineMath', {
      value: lexicalNode.getValue(),
    });
  },
};
