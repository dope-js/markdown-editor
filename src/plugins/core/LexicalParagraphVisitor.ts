import type { LexicalExportVisitor } from '@/utils';
import type { ParagraphNode } from 'lexical';
import { $isParagraphNode } from 'lexical';
import type * as Mdast from 'mdast';

export const LexicalParagraphVisitor: LexicalExportVisitor<ParagraphNode, Mdast.Paragraph> = {
  testLexicalNode: $isParagraphNode,
  visitLexicalNode: ({ actions }) => {
    actions.addAndStepInto('paragraph');
  },
};
