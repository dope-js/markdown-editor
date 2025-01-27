import { clsx } from 'clsx';
import { noop } from 'lodash-es';
import type { Options as ToMarkdownOptions } from 'mdast-util-to-markdown';
import { forwardRef, useMemo } from 'react';
import { LexicalProvider, Methods, EditorWrapper, RichTextEditor } from './components';
import { EditorProvider } from './contexts';
import type { CodeBlockEditorDescriptor } from './plugins';
import {
  codeBlockPlugin,
  codeMirrorPlugin,
  corePlugin,
  formularPlugin,
  formularBlockPlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  useCodeBlockEditorContext,
  imagePlugin,
} from './plugins';
import type { EditorMethods, EditorProps, EditorPlugin } from './types';

import 'katex/dist/katex.min.css';
import './styles/editor.scss';

const defaultMarkdownOptions: ToMarkdownOptions = {
  listItemIndent: 'one',
};

const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const cb = useCodeBlockEditorContext();
    return (
      <div
        onKeyDown={(e) => {
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <textarea
          rows={3}
          cols={20}
          defaultValue={props.code}
          onChange={(e) => {
            cb.setCode(e.target.value);
          }}
        />
      </div>
    );
  },
};

export const MDXEditor = forwardRef<EditorMethods, EditorProps>(({ showToolbar = true, ...props }, ref) => {
  const plugins: EditorPlugin[] = useMemo(() => {
    const plugins: EditorPlugin[] = [
      corePlugin({
        contentEditableClassName: 'mdxeditor-content',
        spellCheck: props.spellCheck ?? true,
        initialValue: props.value ?? '',
        onChange: props.onChange ?? noop,
        onBlur: props.onBlur ?? noop,
        toMarkdownOptions: props.toMarkdownOptions ?? defaultMarkdownOptions,
        autoFocus: props.autoFocus ?? false,
        placeholder: props.placeholder ?? '',
        readOnly: Boolean(props.readOnly),
        suppressHtmlProcessing: props.suppressHtmlProcessing ?? false,
        onError: props.onError ?? noop,
        trim: props.trim ?? true,
        lexicalTheme: props.lexicalTheme,
      }),
      headingsPlugin(),
      thematicBreakPlugin(),
      listsPlugin(),
      formularPlugin(),
      formularBlockPlugin(),
      quotePlugin(),
      codeBlockPlugin({ codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
      codeMirrorPlugin(),
      tablePlugin(),
      imagePlugin(),
      markdownShortcutPlugin(),
    ];

    if (showToolbar) plugins.push(toolbarPlugin());

    return plugins;
  }, [showToolbar]);

  return (
    <EditorProvider editorProps={props}>
      <EditorWrapper plugins={plugins}>
        <div className={clsx('dme-body', 'mdxeditor', props.className)}>
          <LexicalProvider>
            <RichTextEditor />
          </LexicalProvider>
        </div>
        <Methods mdxRef={ref} />
      </EditorWrapper>
    </EditorProvider>
  );
});

MDXEditor.displayName = 'MDXEditor';
