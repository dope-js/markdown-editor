import { MDXEditor } from '@dope-js/markdown-editor';
import './App.css';

function App() {
  return (
    <>
      <MDXEditor locale="en-US" imageUploadUrl="" imageUploadResponseHandler={() => ''} />
    </>
  );
}

export default App;
