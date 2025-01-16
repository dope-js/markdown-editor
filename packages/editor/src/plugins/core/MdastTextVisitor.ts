import type { MdastImportVisitor } from '@/utils';
import { $createTextNode } from 'lexical';
import type * as Mdast from 'mdast';

export const MdastTextVisitor: MdastImportVisitor<Mdast.Text> = {
  testNode: 'text',
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto($createTextNode(mdastNode.value).setFormat(actions.getParentFormatting()));
  },
};
