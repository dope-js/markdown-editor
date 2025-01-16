import type { MdastImportVisitor } from '@/utils';
import type { Math } from 'mdast-util-math';
import { $createFormularBlockNode } from './FormularBlockNode';

export const MdastFormularBlockVisitor: MdastImportVisitor<Math> = {
  testNode: (node) => node.type === 'math',
  visitNode({ mdastNode, actions }) {
    actions.addAndStepInto($createFormularBlockNode({ value: mdastNode.value }));
  },
};
