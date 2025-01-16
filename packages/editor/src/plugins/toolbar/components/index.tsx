import { Divider } from '@douyinfe/semi-ui';
import type { FC } from 'react';
import { InsertCodeBlock } from './code-block';
import { InsertFormular } from './formular';
// import { InsertImage } from './image';
import { CodeToggle } from './inline-block';
import { InsertTable } from './InsertTable';
import { InsertThematicBreak } from './InsertThematicBreak';
import { ListsToggle } from './list';
import { BoldItalicUnderlineToggles } from './text-style';
import { UndoRedo } from './undo-redo';

/**
 * A toolbar component that includes all toolbar components.
 * Notice that some of the buttons will work only if you have the corresponding plugin enabled, so you should use it only for testing purposes.
 * You'll probably want to create your own toolbar component that includes only the buttons that you need.
 * @group Toolbar Components
 */
export const EditorToolbar: FC = () => {
  return (
    <>
      <UndoRedo />
      <Divider layout="vertical" />
      <BoldItalicUnderlineToggles />
      <CodeToggle />
      <Divider layout="vertical" />
      <ListsToggle options={['bullet', 'number']} />
      <Divider layout="vertical" />
      {/* <InsertImage /> */}
      <InsertTable />
      <InsertFormular />
      <InsertCodeBlock />
      <Divider layout="vertical" />
      <InsertThematicBreak />
    </>
  );
};
