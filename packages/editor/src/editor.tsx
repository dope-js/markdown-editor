import { clsx } from 'clsx';
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
import './styles/editor.scss';
import type { EditorMethods, EditorProps, EditorPlugin } from './types';
import { noop } from './utils';

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

export const MDXEditor = forwardRef<EditorMethods, EditorProps>((props, ref) => {
  const plugins: EditorPlugin[] = useMemo(() => {
    const plugins: EditorPlugin[] = [
      corePlugin({
        contentEditableClassName: 'mdxeditor-content',
        spellCheck: props.spellCheck ?? true,
        initialMarkdown: props.markdown ?? '',
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

    if (props.showToolbar) plugins.push(toolbarPlugin());

    return plugins;
  }, [props.showToolbar]);

  return (
    <EditorProvider editorProps={props}>
      <EditorWrapper plugins={plugins}>
        <div className={clsx('mdxeditor', props.className)}>
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
