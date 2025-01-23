import type { LexicalExportVisitor } from '@/utils';
import type * as Mdast from 'mdast';
import type { TableNode } from './TableNode';
import { $isTableNode } from './TableNode';

export const LexicalTableVisitor: LexicalExportVisitor<TableNode, Mdast.Table> = {
  testLexicalNode: $isTableNode,
  visitLexicalNode({ actions, mdastParent, lexicalNode }) {
    actions.appendToParent(mdastParent, lexicalNode.getMdastNode());
  },
};
