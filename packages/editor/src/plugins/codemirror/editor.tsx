import { EditorButton, IconDelete } from '@/components';
import { useEditor } from '@/contexts';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { Select } from '@douyinfe/semi-ui';
import { useCellValues } from '@mdxeditor/gurx';
import { basicDark } from 'cm6-theme-basic-dark';
import { basicLight } from 'cm6-theme-basic-light';
import { basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import { codeBlockLanguages$, codeMirrorAutoLoadLanguageSupport$, codeMirrorExtensions$ } from '.';
import styles from './codemirror.module.scss';
import type { CodeBlockEditorProps } from '../codeblock';
import { useCodeBlockEditorContext } from '../codeblock/node';
import { readOnly$ } from '../core';

const emptyValue = '__EMPTY_VALUE__';

export const CodeMirrorEditor = ({ language, code }: CodeBlockEditorProps) => {
  const { parentEditor, lexicalNode } = useCodeBlockEditorContext();
  const [readOnly, codeMirrorExtensions, autoLoadLanguageSupport, codeBlockLanguages] = useCellValues(
    readOnly$,
    codeMirrorExtensions$,
    codeMirrorAutoLoadLanguageSupport$,
    codeBlockLanguages$
  );

  const { dark, t } = useEditor();

  const { setCode } = useCodeBlockEditorContext();
  const editorViewRef = useRef<EditorView | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  const setCodeRef = useRef(setCode);
  setCodeRef.current = setCode;

  useEffect(() => {
    void (async () => {
      const theme = dark ? basicDark : basicLight;
      const extensions = [
        ...codeMirrorExtensions,
        basicSetup,
        theme,
        lineNumbers(),
        EditorView.lineWrapping,
        EditorView.updateListener.of(({ state }) => {
          setCodeRef.current(state.doc.toString());
        }),
      ];

      if (readOnly) {
        extensions.push(EditorState.readOnly.of(true));
      }

      if (language !== '' && autoLoadLanguageSupport) {
        const languageData = languages.find((l) => {
          return l.name === language || l.alias.includes(language) || l.extensions.includes(language);
        });

        if (languageData) {
          try {
            const languageSupport = await languageData.load();
            extensions.push(languageSupport.extension);
          } catch {
            console.warn('failed to load language support for', language);
          }
        }
      }

      elRef.current!.innerHTML = '';
      editorViewRef.current = new EditorView({
        parent: elRef.current!,
        state: EditorState.create({ doc: code, extensions }),
      });
    })();

    return () => {
      editorViewRef.current?.destroy();
      editorViewRef.current = null;
    };
  }, [readOnly, language, dark]);

  return (
    <div
      className={styles.wrapper}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.toolbar}>
        <Select
          size="small"
          value={language}
          filter
          style={{ minWidth: 120 }}
          onChange={(language) => {
            if (!(typeof language === 'string')) return;

            parentEditor.update(() => {
              lexicalNode.setLanguage(language === emptyValue ? '' : language);
              setTimeout(() => {
                parentEditor.update(() => {
                  lexicalNode.getLatest().select();
                });
              });
            });
          }}
          optionList={Object.entries(codeBlockLanguages).map(([value, label]) => ({
            value: value ?? emptyValue,
            label,
          }))}
        />
        <EditorButton
          icon={<IconDelete />}
          title={t('codeblock.remove')}
          size="small"
          minor
          onClick={(e) => {
            e.preventDefault();
            parentEditor.update(() => {
              lexicalNode.remove();
            });
          }}
        />
      </div>
      <div ref={elRef} />
    </div>
  );
};
