import { MDXEditor } from '@dope-js/markdown-editor';
import './App.css';
import '@dope-js/markdown-editor/style.css';

const markdown = `
| foo | bar |
| --- | --- |
| baz | bim |
`;

function App() {
  return (
    <div className="wrapper">
      <MDXEditor className="editor" placeholder="22334" value={markdown} />
    </div>
  );
}

export default App;
