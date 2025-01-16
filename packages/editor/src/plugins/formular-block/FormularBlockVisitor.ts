import type { LexicalExportVisitor } from '@/utils';
import type { Math } from 'mdast-util-math';
import type { FormularBlockNode } from './FormularBlockNode';
import { $isFormularBlockNode } from './FormularBlockNode';

export const FormularBlockVisitor: LexicalExportVisitor<FormularBlockNode, Math> = {
  testLexicalNode: $isFormularBlockNode,
  visitLexicalNode: ({ lexicalNode, actions }) => {
    actions.addAndStepInto('math', {
      value: lexicalNode.getValue(),
    });
  },
};
