import type { MdastImportVisitor } from '@/utils';
import { $createHeadingNode } from '@lexical/rich-text';
import type * as Mdast from 'mdast';

export const MdastHeadingVisitor: MdastImportVisitor<Mdast.Heading> = {
  testNode: 'heading',
  visitNode: function ({ mdastNode, actions }): void {
    actions.addAndStepInto($createHeadingNode(`h${mdastNode.depth}`));
  },
};
