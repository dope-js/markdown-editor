import {
  composerChildren$,
  contentEditableRef$,
  editorWrappers$,
  placeholder$,
  spellCheck$,
  topAreaChildren$,
} from '@/plugins';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import { clsx } from 'clsx';
import type { ComponentType, FC, ReactNode } from 'react';

interface IRenderRecursiveWrappersProps {
  wrappers: ComponentType<{ children: ReactNode }>[];
  children: ReactNode;
}

const RenderRecursiveWrappers: FC<IRenderRecursiveWrappersProps> = ({ wrappers, children }) => {
  if (wrappers.length === 0) {
    return <>{children}</>;
  }
  const Wrapper = wrappers[0];
  return (
    <Wrapper>
      <RenderRecursiveWrappers wrappers={wrappers.slice(1)}>{children}</RenderRecursiveWrappers>
    </Wrapper>
  );
};

export const RichTextEditor: FC = () => {
  const setContentEditableRef = usePublisher(contentEditableRef$);
  const onRef = (_contentEditableRef: HTMLDivElement) => setContentEditableRef({ current: _contentEditableRef });

  const [spellCheck, composerChildren, topAreaChildren, editorWrappers, placeholder] = useCellValues(
    spellCheck$,
    composerChildren$,
    topAreaChildren$,
    editorWrappers$,
    placeholder$
  );

  return (
    <>
      {topAreaChildren.map((Child, index) => (
        <Child key={index} />
      ))}
      <RenderRecursiveWrappers wrappers={editorWrappers}>
        <div className="mdxeditor-wrapper">
          <RichTextPlugin
            contentEditable={
              <div ref={onRef}>
                <ContentEditable className="mdxeditor-content" spellCheck={spellCheck} />
              </div>
            }
            placeholder={
              <div className={clsx('mdxeditor-content', 'editor-content-placeholder')}>
                <p>{placeholder}</p>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </RenderRecursiveWrappers>
      {composerChildren.map((Child, index) => (
        <Child key={index} />
      ))}
    </>
  );
};
