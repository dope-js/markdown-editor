import type { EditorProps } from '@/types';
import type { AxiosResponse } from 'axios';
import type { LexicalEditor } from 'lexical';
import type { ReactNode } from 'react';
import type { enUS } from './locale/en-US';

export interface IEditorContext {
  rootEditor: LexicalEditor | null;
  t: (key: keyof typeof enUS, params?: Record<string, string>) => string;
  dark: boolean;
  imageUploadUrl: string;
  imageUploadHeaders?: Record<string, string>;
  imageUploadResponseHandler: (res: AxiosResponse) => string | { message: string };
}

export interface IEditorProviderProps {
  children: ReactNode;
  editorProps: EditorProps;
}
