import { defineEditorPlugin } from '@/utils';
import { Signal, map } from '@mdxeditor/gurx';
import { addActivePlugin$, addExportVisitor$, addImportVisitor$, addLexicalNode$, insertDecoratorNode$ } from '../core';
import type { CreateFormularBlockNodeOptions } from './FormularBlockNode';
import { $createFormularBlockNode, FormularBlockNode } from './FormularBlockNode';
import { FormularBlockVisitor } from './FormularBlockVisitor';
import { MdastFormularBlockVisitor } from './MdastFormularBlockVisitor';

export const formularBlockPlugin = defineEditorPlugin({
  init(realm) {
    realm.pubIn({
      [addActivePlugin$]: 'formular-block',
      [addImportVisitor$]: MdastFormularBlockVisitor,
      [addLexicalNode$]: FormularBlockNode,
      [addExportVisitor$]: FormularBlockVisitor,
    });
  },
});

export const insertFormularBlock$ = Signal<Partial<CreateFormularBlockNodeOptions>>((r) => {
  r.link(
    r.pipe(
      insertFormularBlock$,
      map(({ value }) => {
        return () => {
          return $createFormularBlockNode({ value: value ?? '' });
        };
      })
    ),
    insertDecoratorNode$
  );
});
