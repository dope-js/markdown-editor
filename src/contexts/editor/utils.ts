import type { EditorProps } from '@/types';
import { noop } from 'lodash-es';
import type { IEditorContext } from './types';

export function initContext(editorProps: EditorProps): Omit<IEditorContext, 'rootEditor' | 't'> {
  const value: Omit<IEditorContext, 'rootEditor' | 't'> = {
    dark: editorProps.dark ?? false,
    handleUpload: editorProps.handleUpload ?? noop,
  };

  return value;
}
