import type { LexicalExportVisitor } from '@/utils';
import type { ListNode } from '@lexical/list';
import { $isListNode } from '@lexical/list';
import type * as Mdast from 'mdast';

export const LexicalListVisitor: LexicalExportVisitor<ListNode, Mdast.List> = {
  testLexicalNode: $isListNode,
  visitLexicalNode: ({ lexicalNode, actions }) => {
    actions.addAndStepInto('list', {
      ordered: lexicalNode.getListType() === 'number',
      spread: false,
    });
  },
};
