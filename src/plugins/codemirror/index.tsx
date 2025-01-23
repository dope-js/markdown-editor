import { defineEditorPlugin } from '@/utils';
import type { Extension } from '@codemirror/state';
import { Cell, Signal, map } from '@mdxeditor/gurx';
import type { CodeBlockEditorDescriptor } from '../codeblock';
import { appendCodeBlockEditorDescriptor$, insertCodeBlock$ } from '../codeblock';
import { CodeMirrorEditor } from './editor';

/**
 * The codemirror code block languages.
 * @group CodeMirror
 */
export const codeBlockLanguages$ = Cell({
  js: 'JavaScript',
  ts: 'TypeScript',
  tsx: 'TypeScript (React)',
  jsx: 'JavaScript (React)',
  css: 'CSS',
  c: 'C',
});

export const defaultLanguages = {
  txt: 'Plain Text',
  c: 'C',
  cpp: 'C++',
  java: 'Java',
  py: 'Python',
  js: 'JavaScript',
  ts: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  sql: 'SQL',
  rs: 'Rust',
  php: 'PHP',
  go: 'Go',
  rb: 'Ruby',
  '': 'Unspecified',
};

/**
 * Inserts a new code mirror code block with the specified parameters.
 * @group CodeMirror
 */
export const insertCodeMirror$ = Signal<{ language?: string; code?: string }>((r) => {
  r.link(
    r.pipe(
      insertCodeMirror$,
      map(({ language, code }) => {
        return {
          code: code ?? '',
          language: language ?? 'txt',
          meta: '',
        };
      })
    ),
    insertCodeBlock$
  );
});

/**
 * The code mirror extensions for the coemirror code block editor.
 * @group CodeMirror
 */
export const codeMirrorExtensions$ = Cell<Extension[]>([]);

/**
 * Whether or not to try to dynamically load the code block language support.
 * Disable if you want to manually pass the supported languages.
 * @group CodeMirror
 */
export const codeMirrorAutoLoadLanguageSupport$ = Cell<boolean>(true);

/**
 * A plugin that adds lets users edit code blocks with CodeMirror.
 * @group CodeMirror
 */
export const codeMirrorPlugin = defineEditorPlugin<{
  codeBlockLanguages?: Record<string, string>;
  /**
   * Optional, additional CodeMirror extensions to load in the diff/source mode.
   */
  codeMirrorExtensions?: Extension[];
  /**
   * Whether or not to try to dynamically load the code block language support.
   * Disable if you want to manually pass the supported languages.
   * @group CodeMirror
   */
  autoLoadLanguageSupport?: boolean;
}>({
  update(r, params) {
    r.pubIn({
      [codeBlockLanguages$]: params?.codeBlockLanguages ?? defaultLanguages,
      [codeMirrorExtensions$]: params?.codeMirrorExtensions ?? [],
      [codeMirrorAutoLoadLanguageSupport$]: params?.autoLoadLanguageSupport ?? true,
    });
  },

  init(r, params) {
    r.pubIn({
      [codeBlockLanguages$]: params?.codeBlockLanguages ?? defaultLanguages,
      [codeMirrorExtensions$]: params?.codeMirrorExtensions ?? [],
      [appendCodeBlockEditorDescriptor$]: buildCodeBlockDescriptor(),
      [codeMirrorAutoLoadLanguageSupport$]: params?.autoLoadLanguageSupport ?? true,
    });
  },
});

function buildCodeBlockDescriptor(): CodeBlockEditorDescriptor {
  return {
    match(language, meta) {
      return !meta;
    },
    priority: 1,
    Editor: CodeMirrorEditor,
  };
}
