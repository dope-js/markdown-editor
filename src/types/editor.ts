import type { EditorThemeClasses } from 'lexical';
import type { Options as ToMarkdownOptions } from 'mdast-util-to-markdown';
import type { ReactNode } from 'react';

export interface EditorMethods {
  /**
   * Gets the current markdown value.
   */
  getValue: () => string;

  /**
   * Updates the markdown value of the editor.
   */
  setValue: (value: string) => void;

  /**
   * Inserts markdown at the current cursor position. Use the focus if necessary.
   */
  insertMarkdown: (value: string) => void;

  /**
   * Sets focus on input
   */
  focus: (
    callbackFn?: (() => void) | undefined,
    opts?: {
      defaultSelection?: 'rootStart' | 'rootEnd';
      preventScroll?: boolean;
    }
  ) => void;
}

export interface HandleUploadArgs {
  file: File;
  onError: (message?: string) => void;
  onSuccess: (args: { url: string; width?: number; height?: number }) => void;
  onProgress: (progress: number) => void;
}

export type HandleUploadFn = (args: HandleUploadArgs) => void | Promise<void>;

export interface EditorProps {
  /**
   * the CSS class to apply to the content editable element of the editor.
   * Use this to style the various content elements like lists and blockquotes.
   */
  contentEditableClassName?: string;
  /**
   * Controls the spellCheck value for the content editable element of the eitor.
   * Defaults to true, use false to disable spell checking.
   */
  spellCheck?: boolean;
  /**
   * The markdown to edit. Notice that this is read only when the component is mounted.
   * To change the component content dynamically, use the `MDXEditorMethods.setValue` method.
   */
  value?: string;
  /**
   * Triggered when the editor value changes. The callback is not throttled, you can use any throttling mechanism
   * if you intend to do auto-saving.
   */
  onChange?: (markdown: string) => void;
  /**
   * Triggered when the markdown parser encounters an error. The payload includes the invalid source and the error message.
   */
  onError?: (payload: { error: string; source: string }) => void;
  /**
   * The markdown options used to generate the resulting markdown.
   * See {@link https://github.com/syntax-tree/mdast-util-to-markdown#options | the mdast-util-to-markdown docs} for the full list of options.
   */
  toMarkdownOptions?: ToMarkdownOptions;
  /**
   * pass if you would like to have the editor automatically focused when mounted.
   */
  autoFocus?: boolean | { defaultSelection?: 'rootStart' | 'rootEnd'; preventScroll?: boolean };
  /**
   * Triggered when focus leaves the editor
   */
  onBlur?: (e: FocusEvent) => void;
  /**
   * The placeholder contents, displayed when the editor is empty.
   */
  placeholder?: ReactNode;
  /**
   * pass if you would like to have the editor in read-only mode.
   * Note: Don't use this mode to render content for consumption - render the markdown using a library of your choice instead.
   */
  readOnly?: boolean;
  /**
   * Set to false if you want to suppress the processing of HTML tags.
   */
  suppressHtmlProcessing?: boolean;
  /**
   * Whether to apply trim() to the initial markdown input (default: true)
   */
  trim?: boolean;

  /**
   * A custom lexical theme to use for the editor.
   */
  lexicalTheme?: EditorThemeClasses;

  showToolbar?: boolean;
  className?: string;

  dark?: boolean;

  handleUpload?: HandleUploadFn;

  locale?: 'zh-CN' | 'en-US';
}
