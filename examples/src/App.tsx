import { MDXEditor, MDXViewer } from '@dope-js/markdown-editor';
import '@dope-js/markdown-editor/style.css';
import { useState } from 'react';
import styles from './app.module.scss';
import { Header } from './components/header';
import markdown from './markdown.mdx?raw';
import { getImageSize, uploadFile } from './utils';

function App() {
  const [value, setValue] = useState(markdown);
  const [locale, setLocale] = useState<'en-US' | 'zh-CN'>('en-US');

  return (
    <div className={`${styles.wrapper} dme-body`}>
      <Header locale={locale} setLocale={setLocale} />
      <div className={styles.main}>
        <div className={styles.area}>
          <div className={styles.title}>Editor</div>
          <div className={styles.content}>
            <MDXEditor
              className={styles.editor}
              locale={locale}
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
          </div>
        </div>
        <div className={styles.area}>
          <div className={styles.title}>Viewer</div>
          <div className={`${styles.content} ${styles['viewer-wrapper']}`}>
            <MDXViewer className={styles.viewer} markdown={value} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
