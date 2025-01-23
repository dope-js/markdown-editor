import type { LexicalExportVisitor } from '@/utils';
import type { LineBreakNode } from 'lexical';
import { $isLineBreakNode } from 'lexical';
import type * as Mdast from 'mdast';

export const LexicalLinebreakVisitor: LexicalExportVisitor<LineBreakNode, Mdast.Text> = {
  testLexicalNode: $isLineBreakNode,
  visitLexicalNode: ({ mdastParent, actions }) => {
    actions.appendToParent(mdastParent, { type: 'text', value: '\n' });
  },
};
