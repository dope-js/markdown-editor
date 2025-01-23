import type { FC } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { enUS, zhCN } from './locale';
import type { IEditorContext, IEditorProviderProps } from './types';
import { initContext } from './utils';

const EditorContext = createContext<IEditorContext | null>(null);

export const EditorProvider: FC<IEditorProviderProps> = ({ children, editorProps }) => {
  const value = useMemo(() => initContext(editorProps), [editorProps]);

  useEffect(() => {
    if (editorProps.dark) {
      document.body.setAttribute('dme-theme', 'dark');
    } else {
      if (document.body.hasAttribute('dme-theme')) {
        document.body.removeAttribute('dme-theme');
      }
    }
  }, [editorProps.dark]);

  const t = useCallback(
    (key: keyof typeof enUS, params?: Record<string, string>) => {
      const language = editorProps.locale === 'zh-CN' ? zhCN : enUS;

      const value = language[key] ?? enUS[key] ?? key;
      return value.replaceAll(/\{\{([A-Za-z][A-Za-z0-9]+)\}\}/g, (_, key) => params?.[key] ?? key);
    },
    [editorProps.locale]
  );

  return <EditorContext.Provider value={{ rootEditor: null, t, ...value }}>{children}</EditorContext.Provider>;
};

export function useEditor(): IEditorContext {
  const ctx = useContext(EditorContext);

  if (!ctx) {
    throw new Error('useEditor must be used within a EditorProvider');
  }

  return ctx;
}
