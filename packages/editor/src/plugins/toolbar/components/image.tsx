import { EditorButton, IconImage, UploadModal } from '@/components';
import { useEditor } from '@/contexts';
import { useCellValues } from '@mdxeditor/gurx';
import { useState, type FC } from 'react';
import { readOnly$ } from '../../core';

export const InsertImage: FC = () => {
  const [readOnly] = useCellValues(readOnly$);
  const { imageUploadUrl, imageUploadHeaders, imageUploadResponseHandler, t } = useEditor();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <EditorButton
        icon={<IconImage />}
        title={t('toolbar.image')}
        disabled={readOnly}
        onClick={() => setModalVisible(true)}
      />
      {modalVisible && (
        <UploadModal
          visible={modalVisible}
          setVisible={setModalVisible}
          uploadUrl={imageUploadUrl}
          uploadRequestHeaders={imageUploadHeaders}
          checkResponse={imageUploadResponseHandler}
        />
      )}
    </>
  );
};
