import type { EditorProps } from '@/types';
import type { IEditorContext } from './types';

export function initContext(editorProps: EditorProps): Omit<IEditorContext, 'rootEditor' | 't'> {
  const value: Omit<IEditorContext, 'rootEditor' | 't'> = {
    dark: editorProps.dark ?? false,
    imageUploadUrl: editorProps.imageUploadUrl,
    imageUploadHeaders: editorProps.imageUploadHeaders,
    imageUploadResponseHandler: editorProps.imageUploadResponseHandler,
  };

  return value;
}
