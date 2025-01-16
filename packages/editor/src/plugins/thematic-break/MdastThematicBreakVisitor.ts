import type { MdastImportVisitor } from '@/utils';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import type * as Mdast from 'mdast';

export const MdastThematicBreakVisitor: MdastImportVisitor<Mdast.ThematicBreak> = {
  testNode: 'thematicBreak',
  visitNode({ actions }) {
    actions.addAndStepInto($createHorizontalRuleNode());
  },
};
