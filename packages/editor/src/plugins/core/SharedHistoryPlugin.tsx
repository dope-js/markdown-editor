import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useCellValue } from '@mdxeditor/gurx';
import { historyState$ } from '.';

export const SharedHistoryPlugin = () => {
  return <HistoryPlugin externalHistoryState={useCellValue(historyState$)} />;
};
