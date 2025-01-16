import styles from '@/styles/lexical-theme.module.css';
import type { EditorThemeClasses } from 'lexical';

export const lexicalTheme: EditorThemeClasses = {
  text: {
    bold: styles.bold,
    italic: styles.italic,
    underline: styles.underline,
    code: styles.code,
    strikethrough: styles.strikethrough,
    subscript: styles.subscript,
    superscript: styles.superscript,
    underlineStrikethrough: styles.underlineStrikethrough,
  },
  list: {
    listitem: styles.listitem,
    listitemChecked: styles.listItemChecked,
    listitemUnchecked: styles.listItemUnchecked,
    nested: {
      listitem: styles.nestedListItem,
    },
  },
};
