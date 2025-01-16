import { EditorButton, IconBold, IconItalic, IconStrikeThrough, IconUnderline } from '@/components';
import { Format } from '@/constants';
import { useEditor } from '@/contexts';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import type { FC } from 'react';
import { useCallback } from 'react';
import { applyFormat$, currentFormat$ } from '../../core';

export interface BoldItalicUnderlineTogglesProps {
  options?: ('Bold' | 'Italic' | 'Underline' | 'Strikethrough')[];
}

/**
 * A toolbar component that lets the user toggle bold, italic and underline formatting.
 * @group Toolbar Components
 */
export const BoldItalicUnderlineToggles: FC<BoldItalicUnderlineTogglesProps> = ({ options }) => {
  const { t } = useEditor();
  const [currentFormat] = useCellValues(currentFormat$);
  const applyFormat = usePublisher(applyFormat$);
  const showAllButtons = typeof options === 'undefined';

  const isActive = useCallback((format: Format) => (currentFormat & format) !== 0, [currentFormat]);

  return (
    <>
      {showAllButtons || options.includes('Bold') ? (
        <EditorButton
          icon={<IconBold />}
          active={isActive(Format.Bold)}
          title={t('toolbar.bold.title')}
          activeTitle={t('toolbar.bold.remove')}
          onClick={() => applyFormat('bold')}
        />
      ) : null}
      {showAllButtons || options.includes('Italic') ? (
        <EditorButton
          icon={<IconItalic />}
          active={isActive(Format.Italic)}
          title={t('toolbar.italic.title')}
          activeTitle={t('toolbar.italic.remove')}
          onClick={() => applyFormat('italic')}
        />
      ) : null}
      {showAllButtons || options.includes('Underline') ? (
        <EditorButton
          icon={<IconUnderline />}
          active={isActive(Format.Underline)}
          title={t('toolbar.underline.title')}
          activeTitle={t('toolbar.underline.remove')}
          onClick={() => applyFormat('underline')}
        />
      ) : null}
      {showAllButtons || options.includes('Strikethrough') ? (
        <EditorButton
          icon={<IconStrikeThrough />}
          active={isActive(Format.Strikethrough)}
          title={t('toolbar.strikethrough.title')}
          activeTitle={t('toolbar.strikethrough.remove')}
          onClick={() => applyFormat('strikethrough')}
        />
      ) : null}
    </>
  );
};
