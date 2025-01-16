import type { LexicalExportVisitor } from '@/utils';
import type { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import type * as Mdast from 'mdast';

export const LexicalThematicBreakVisitor: LexicalExportVisitor<HorizontalRuleNode, Mdast.ThematicBreak> = {
  testLexicalNode: $isHorizontalRuleNode,
  visitLexicalNode({ actions }) {
    actions.addAndStepInto('thematicBreak');
  },
};
