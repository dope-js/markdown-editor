import { MDXEditor } from '@dope-js/markdown-editor';
import './App.css';
import '@dope-js/markdown-editor/style.css';

function App() {
  return (
    <div className="wrapper">
      <MDXEditor
        locale="en-US"
        imageUploadUrl=""
        imageUploadResponseHandler={() => ''}
        className="editor"
        showToolbar
      />
    </div>
  );
}

export default App;
