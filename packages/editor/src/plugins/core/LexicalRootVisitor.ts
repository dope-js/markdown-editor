import type { LexicalExportVisitor } from '@/utils';
import type { RootNode as LexicalRootNode } from 'lexical';
import { $isRootNode } from 'lexical';
import type * as Mdast from 'mdast';

export const LexicalRootVisitor: LexicalExportVisitor<LexicalRootNode, Mdast.Root> = {
  testLexicalNode: $isRootNode,
  visitLexicalNode: ({ actions }) => {
    actions.addAndStepInto('root');
  },
};
