import type { MdastImportVisitor } from '@/utils';
import { $createListItemNode, $createListNode, $isListItemNode } from '@lexical/list';
import type { ElementNode } from 'lexical';
import type * as Mdast from 'mdast';

export const MdastListVisitor: MdastImportVisitor<Mdast.List> = {
  testNode: 'list',
  visitNode: function ({ mdastNode, lexicalParent, actions }): void {
    const listType = mdastNode.children.some((e) => typeof e.checked === 'boolean')
      ? 'check'
      : mdastNode.ordered
        ? 'number'
        : 'bullet';
    const lexicalNode = $createListNode(listType);

    if ($isListItemNode(lexicalParent)) {
      const dedicatedParent = $createListItemNode();
      dedicatedParent.append(lexicalNode);
      lexicalParent.insertAfter(dedicatedParent);
    } else {
      (lexicalParent as ElementNode).append(lexicalNode);
    }

    actions.visitChildren(mdastNode, lexicalNode);
  },
};
