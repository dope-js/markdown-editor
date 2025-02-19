# DopeJs Markdown Editor

![npm](https://img.shields.io/npm/v/@dope-js/markdown-editor)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@dope-js/markdown-editor)

A wysiwyg markdown editor. Demo: https://editor.dopejs.dev

## Install

```bash
# npm
npm install @dope-js/markdown-editor

# yarn
yarn add @dope-js/markdown-editor

# pnpm
pnpm add @dope-js/markdown-editor
```

## Usage

### Editor

```tsx
import { MDXEditor } from '@dope-js/markdown-editor';

export default function Page() {
  return <MDXEditor />;
}
```

### Viewer

```tsx
import { MDXViewer } from '@dope-js/markdown-editor';

export default function Page() {
  return <MDXViewer mdx={'# test'} />;
}
```

## Reference

- [@mdxeditor/editor](https://github.com/mdx-editor/editor)
- [@douyinfe/semi-ui](https://github.com/DouyinFE/semi-design)
