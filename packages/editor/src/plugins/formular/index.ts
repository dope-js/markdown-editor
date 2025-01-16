import { defineEditorPlugin } from '@/utils';
import { Signal, map } from '@mdxeditor/gurx';
import { addActivePlugin$, addExportVisitor$, addImportVisitor$, addLexicalNode$, insertDecoratorNode$ } from '../core';
import type { CreateFormularNodeOptions } from './FormularNode';
import { $createFormularNode, FormularNode } from './FormularNode';
import { FormularVisitor } from './FormularVisitor';
import { MdastFormularVisitor } from './MdastFormularVisitor';

export const formularPlugin = defineEditorPlugin({
  init(realm) {
    realm.pubIn({
      [addActivePlugin$]: 'formular',
      [addImportVisitor$]: MdastFormularVisitor,
      [addLexicalNode$]: FormularNode,
      [addExportVisitor$]: FormularVisitor,
    });
  },
});

export const insertFormular$ = Signal<Partial<CreateFormularNodeOptions>>((r) => {
  r.link(
    r.pipe(
      insertFormular$,
      map(({ value }) => {
        return () => {
          return $createFormularNode({ value: value ?? '', isInsert: true, autoFocus: true });
        };
      })
    ),
    insertDecoratorNode$
  );
});
