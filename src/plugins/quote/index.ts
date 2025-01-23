import { defineEditorPlugin } from '@/utils';
import { $createQuoteNode, QuoteNode } from '@lexical/rich-text';
import { Signal } from '@mdxeditor/gurx';
import { LexicalQuoteVisitor } from './LexicalQuoteVisitor';
import { MdastBlockQuoteVisitor } from './MdastBlockQuoteVisitor';
import { addActivePlugin$, addImportVisitor$, addLexicalNode$, addExportVisitor$ } from '../core';

export const insertQuote$ = Signal((r) => {
  r.sub(r.pipe(insertQuote$), () => {
    $createQuoteNode();
  });
});

/**
 * A plugin that adds support for block quotes to the editor.
 * @group Quote
 */
export const quotePlugin = defineEditorPlugin({
  init(realm) {
    realm.pubIn({
      [addActivePlugin$]: 'quote',
      [addImportVisitor$]: MdastBlockQuoteVisitor,
      [addLexicalNode$]: QuoteNode,
      [addExportVisitor$]: LexicalQuoteVisitor,
    });
  },
});
