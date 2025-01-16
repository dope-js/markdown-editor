import { rootEditor$ } from '@/plugins';
import { lexicalTheme } from '@/utils';
import type { LexicalComposerContextType } from '@lexical/react/LexicalComposerContext';
import { LexicalComposerContext, createLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCellValue } from '@mdxeditor/gurx';
import type { LexicalEditor } from 'lexical';
import type { FC } from 'react';
import { useMemo } from 'react';

interface ILexicalProviderProps {
  children: JSX.Element | string | (JSX.Element | string)[];
}

export const LexicalProvider: FC<ILexicalProviderProps> = ({ children }) => {
  const rootEditor = useCellValue(rootEditor$)!;
  const composerContextValue = useMemo(() => {
    return [rootEditor, createLexicalComposerContext(null, lexicalTheme)] as [
      LexicalEditor,
      LexicalComposerContextType,
    ];
  }, [rootEditor]);

  return <LexicalComposerContext.Provider value={composerContextValue}>{children}</LexicalComposerContext.Provider>;
};
