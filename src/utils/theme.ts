import type { EditorThemeClasses } from 'lexical';

import '../styles/lexical-theme.scss';

export const lexicalTheme: EditorThemeClasses = {
  text: {
    bold: 'dme-theme-bold',
    italic: 'dme-theme-italic',
    underline: 'dme-theme-underline',
    code: 'dme-theme-code',
    strikethrough: 'dme-theme-strikethrough',
    subscript: 'dme-theme-subscript',
    superscript: 'dme-theme-superscript',
    underlineStrikethrough: 'dme-theme-underline-strikethrough',
  },
  list: {
    listitem: 'dme-theme-listitem',
    listitemChecked: 'dme-theme-listitem_checked',
    listitemUnchecked: 'dme-theme-listitem_unchecked',
    nested: {
      listitem: 'dme-theme-nested-listitem',
    },
  },
};
