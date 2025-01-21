import type { EditorProps, HandleUploadFn, TranslateFn } from '@/types';
import type { LexicalEditor } from 'lexical';
import type { ReactNode } from 'react';

export interface IEditorContext {
  rootEditor: LexicalEditor | null;
  t: TranslateFn;
  dark: boolean;
  handleUpload: HandleUploadFn;
}

export interface IEditorProviderProps {
  children: ReactNode;
  editorProps: EditorProps;
}
