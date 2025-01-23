import type { LexicalExportVisitor } from '@/utils';
import type * as Mdast from 'mdast';
import type { CodeBlockNode } from './node';
import { $isCodeBlockNode } from './node';

export const CodeBlockVisitor: LexicalExportVisitor<CodeBlockNode, Mdast.Code> = {
  testLexicalNode: $isCodeBlockNode,
  visitLexicalNode: ({ lexicalNode, actions }) => {
    actions.addAndStepInto('code', {
      value: lexicalNode.getCode(),
      lang: lexicalNode.getLanguage(),
      meta: lexicalNode.getMeta(),
    });
  },
};
