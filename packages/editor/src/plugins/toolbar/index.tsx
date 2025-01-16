import { defineEditorPlugin } from '@/utils';
import { Cell, useCellValues } from '@mdxeditor/gurx';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { addTopAreaChild$, readOnly$ } from '../core';
import { EditorToolbar } from './components';
import styles from './toolbar.module.scss';

/**
 * The factory function that returns the contents of the toolbar.
 * @group Toolbar
 */
export const toolbarContents$ = Cell<() => ReactNode>(() => null);
export const toolbarClassName$ = Cell<string>('');

const defaultToolbarContents = () => <EditorToolbar />;

/**
 * A plugin that adds a toolbar to the editor.
 * @group Toolbar
 */
export const toolbarPlugin = defineEditorPlugin<{ toolbarContents?: () => ReactNode; toolbarClassName?: string }>({
  init(realm, params) {
    realm.pubIn({
      [toolbarContents$]: params?.toolbarContents ?? defaultToolbarContents,
      [toolbarClassName$]: params?.toolbarClassName ?? '',
      [addTopAreaChild$]: () => {
        const [toolbarContents, readOnly, toolbarClassName] = useCellValues(
          toolbarContents$,
          readOnly$,
          toolbarClassName$
        );
        return (
          <div className={clsx(styles.root, toolbarClassName)} {...(readOnly ? { tabIndex: -1 } : {})}>
            {toolbarContents()}
          </div>
        );
      },
    });
  },
  update(realm, params) {
    realm.pub(toolbarContents$, params?.toolbarContents ?? defaultToolbarContents);
    realm.pub(toolbarClassName$, params?.toolbarClassName ?? '');
  },
});
