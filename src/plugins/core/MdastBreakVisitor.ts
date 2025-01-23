import type { MdastImportVisitor } from '@/utils';
import type { ElementNode } from 'lexical';
import { $createLineBreakNode } from 'lexical';
import type * as Mdast from 'mdast';

export const MdastBreakVisitor: MdastImportVisitor<Mdast.Paragraph> = {
  testNode: 'break',
  visitNode: function ({ lexicalParent }): void {
    (lexicalParent as ElementNode).append($createLineBreakNode());
  },
};
