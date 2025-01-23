import type { MdastImportVisitor } from '@/utils';
import type { ElementNode } from 'lexical';
import type * as Mdast from 'mdast';
import { $createTableNode } from './TableNode';

export const MdastTableVisitor: MdastImportVisitor<Mdast.Table> = {
  testNode: 'table',
  visitNode({ mdastNode, lexicalParent }) {
    (lexicalParent as ElementNode).append($createTableNode(mdastNode));
  },
};
