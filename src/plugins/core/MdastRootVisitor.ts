import type { MdastImportVisitor } from '@/utils';
import type * as Mdast from 'mdast';

export const MdastRootVisitor: MdastImportVisitor<Mdast.Root> = {
  testNode: 'root',
  visitNode({ actions, mdastNode, lexicalParent }) {
    actions.visitChildren(mdastNode as unknown as Mdast.Root, lexicalParent);
  },
};
