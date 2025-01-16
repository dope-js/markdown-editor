import { useEditor } from '@/contexts';
import { insertImage$ } from '@/plugins';
import { Form, Modal, Toast } from '@douyinfe/semi-ui';
import type { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import type { FileItem } from '@douyinfe/semi-ui/lib/es/upload';
import { usePublisher } from '@mdxeditor/gurx';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { useRef, type FC } from 'react';

interface IUploadModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  uploadUrl: string;
  uploadRequestHeaders?: Record<string, string>;
  checkResponse: (res: AxiosResponse) => string | { message: string };
}

interface IUploadFormValue {
  file: FileItem[];
  title: string;
}

export function getImageSize(file: File | undefined) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    if (!file) return reject(new Error('file is undefined'));

    if (!file.type.startsWith('image/')) return reject(new Error('file is not image'));

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      resolve({ width, height });
    };

    img.onerror = (e) => {
      reject(e);
    };
  });
}

export const UploadModal: FC<IUploadModalProps> = ({
  visible,
  setVisible,
  uploadUrl,
  uploadRequestHeaders,
  checkResponse,
}) => {
  const { t } = useEditor();
  const formApi = useRef<FormApi<IUploadFormValue>>();

  const maxSize = 5;
  const insertImage = usePublisher(insertImage$);

  return (
    <Modal
      title={t('image.upload.title')}
      visible={visible}
      onCancel={() => setVisible(false)}
      cancelText={t('cancel')}
      okText={t('submit')}
      onOk={() => formApi.current?.submitForm()}
    >
      <Form
        getFormApi={(api) => (formApi.current = api)}
        onSubmit={async (values: IUploadFormValue) => {
          const { file, title } = values;
          if (!Array.isArray(file) || file.length === 0) return;
          const fileItem = file[0];
          const uploadedPath = fileItem.response.data?.path as string;
          if (!uploadedPath) return;

          if (!fileItem.fileInstance) return insertImage({ altText: title, src: uploadedPath });

          try {
            let { width, height } = await getImageSize(fileItem.fileInstance);

            if (width > 500) {
              height = Math.round((height * 500) / width);
              width = 500;
            }

            if (height > 300) {
              width = Math.round((width * 300) / height);
              height = 300;
            }

            insertImage({ altText: title, src: uploadedPath, width, height });
          } catch {
            insertImage({ altText: title, src: uploadedPath });
          } finally {
            setVisible(false);
          }
        }}
      >
        {({ formApi }) => (
          <>
            <Form.Upload
              limit={1}
              maxSize={maxSize * 1024}
              onSizeError={(file) => {
                Toast.error(t('image.upload.error.size', { filename: file.name, maxSize: `${maxSize}MB` }));
              }}
              accept="image/*"
              field="file"
              label={t('image.upload.select_file')}
              action={uploadUrl}
              draggable
              customRequest={async (object) => {
                const formData = new FormData();
                formData.append('file', object.fileInstance);
                const res = await axios.post(object.action, formData, {
                  headers: { ...uploadRequestHeaders },
                  onUploadProgress(progressEvent) {
                    object.onProgress({ total: 1, loaded: progressEvent.progress ?? 0 });
                  },
                });

                object.onProgress({ total: 1, loaded: 1 });

                if (res.status !== 200) {
                  object.file.validateMessage = 'Upload Failed';
                  object.onError({ status: res.status });
                  return;
                }

                const ret = checkResponse(res);

                if (typeof ret === 'object') {
                  object.file.validateMessage = 'Upload Failed';
                  Toast.error(ret.message);
                  object.onError({ status: 500 });
                }

                formApi.setValue('title', object.file.name);

                object.onSuccess({ data: { path: ret } });
              }}
            />
            <Form.Input
              field="title"
              label={t('image.title.label')}
              rules={[{ required: true, message: t('image.title.require') }]}
            />
          </>
        )}
      </Form>
    </Modal>
  );
};
