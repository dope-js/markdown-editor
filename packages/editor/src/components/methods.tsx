import {
  insertMarkdown$,
  markdown$,
  markdownSourceEditorValue$,
  rootEditor$,
  setMarkdown$,
  viewMode$,
} from '@/plugins';
import type { EditorMethods } from '@/types';
import { useRealm } from '@mdxeditor/gurx';
import type { FC, ForwardedRef } from 'react';
import { useImperativeHandle } from 'react';

export const Methods: FC<{ mdxRef: ForwardedRef<EditorMethods> }> = ({ mdxRef }) => {
  const realm = useRealm();

  useImperativeHandle(mdxRef, () => {
    return {
      getMarkdown: () => {
        if (realm.getValue(viewMode$) === 'source') {
          return realm.getValue(markdownSourceEditorValue$);
        }

        return realm.getValue(markdown$);
      },
      setMarkdown: (markdown) => {
        realm.pub(setMarkdown$, markdown);
      },
      insertMarkdown: (markdown) => {
        realm.pub(insertMarkdown$, markdown);
      },
      focus: (
        callbackFn?: (() => void) | undefined,
        opts?: {
          defaultSelection?: 'rootStart' | 'rootEnd';
          preventScroll?: boolean;
        }
      ) => {
        realm.getValue(rootEditor$)?.focus(callbackFn, opts);
      },
    };
  }, [realm]);

  return null;
};
