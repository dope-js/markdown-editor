import type { MdastImportVisitor } from '@/utils';
import { $createQuoteNode } from '@lexical/rich-text';
import type * as Mdast from 'mdast';

export const MdastBlockQuoteVisitor: MdastImportVisitor<Mdast.Blockquote> = {
  testNode: 'blockquote',
  visitNode({ actions }) {
    actions.addAndStepInto($createQuoteNode());
  },
};
