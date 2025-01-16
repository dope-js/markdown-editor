import type { MdastImportVisitor } from '@/utils';
import type { InlineMath } from 'mdast-util-math';
import { $createFormularNode } from './FormularNode';

export const MdastFormularVisitor: MdastImportVisitor<InlineMath> = {
  testNode: (node) => node.type === 'inlineMath',
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto($createFormularNode({ value: mdastNode.value }));
  },
};
