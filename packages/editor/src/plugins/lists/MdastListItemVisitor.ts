import type { MdastImportVisitor } from '@/utils';
import type { ListNode } from '@lexical/list';
import { $createListItemNode } from '@lexical/list';
import type * as Mdast from 'mdast';

export const MdastListItemVisitor: MdastImportVisitor<Mdast.ListItem> = {
  testNode: 'listItem',
  visitNode({ mdastNode, actions, lexicalParent }) {
    const isChecked = (lexicalParent as ListNode).getListType() === 'check' ? (mdastNode.checked ?? false) : undefined;
    actions.addAndStepInto($createListItemNode(isChecked));
  },
};
