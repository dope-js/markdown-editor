import { MDXEditor, MDXViewer } from '@dope-js/markdown-editor';
import './App.css';
import '@dope-js/markdown-editor/style.css';
import { useState } from 'react';

const markdown = `
| foo | bar |
| --- | --- |
| baz | bim |
`;

function getImageSize(file: File | undefined) {
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

function uploadFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(file);
  });
}

function App() {
  const [value, setValue] = useState(markdown);

  return (
    <div className="wrapper">
      <MDXEditor
        className="editor"
        placeholder="Hello world!"
        value={value}
        onChange={setValue}
        handleUpload={async (args) => {
          const src = await uploadFile(args.file);

          args.onProgress(1);

          try {
            let { width, height } = await getImageSize(args.file);

            if (width > 500) {
              height = Math.round((height * 500) / width);
              width = 500;
            }

            if (height > 300) {
              width = Math.round((width * 300) / height);
              height = 300;
            }

            args.onSuccess({ url: src, width, height });
          } catch {
            args.onSuccess({ url: src });
          }
        }}
      />
      <MDXViewer className="viewer" markdown={value} />
    </div>
  );
}

export default App;
