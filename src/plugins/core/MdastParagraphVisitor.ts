import type { MdastImportVisitor } from '@/utils';
import { $createParagraphNode } from 'lexical';
import type * as Mdast from 'mdast';

const lexicalTypesThatShouldSkipParagraphs = ['listitem', 'quote', 'admonition'];

export const MdastParagraphVisitor: MdastImportVisitor<Mdast.Paragraph> = {
  testNode: 'paragraph',
  visitNode: function ({ mdastNode, lexicalParent, actions }): void {
    // markdown inserts paragraphs in lists. lexical does not.
    if (lexicalTypesThatShouldSkipParagraphs.includes(lexicalParent.getType())) {
      actions.visitChildren(mdastNode, lexicalParent);
    } else {
      actions.addAndStepInto($createParagraphNode());
    }
  },
};
