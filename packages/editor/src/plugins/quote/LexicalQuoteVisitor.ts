import type { LexicalExportVisitor } from '@/utils';
import type { QuoteNode } from '@lexical/rich-text';
import { $isQuoteNode } from '@lexical/rich-text';
import type * as Mdast from 'mdast';

export const LexicalQuoteVisitor: LexicalExportVisitor<QuoteNode, Mdast.Blockquote> = {
  testLexicalNode: $isQuoteNode,
  visitLexicalNode: ({ lexicalNode, mdastParent, actions }) => {
    const paragraph: Mdast.Paragraph = { type: 'paragraph', children: [] };
    actions.appendToParent(mdastParent, { type: 'blockquote', children: [paragraph] });
    actions.visitChildren(lexicalNode, paragraph);
  },
};
