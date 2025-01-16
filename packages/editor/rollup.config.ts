import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'rollup';
import { defineConfig } from 'rollup';
import { cssModules } from 'rollup-plugin-css-modules';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import scss from 'rollup-plugin-scss';

const root = dirname(fileURLToPath(import.meta.url));

export default async () => {
  return defineConfig({
    treeshake: {
      moduleSideEffects: 'no-external',
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    },
    input: { index: resolve(root, 'src/index.ts') },
    output: [
      {
        name: 'dopejs-markdown-editor',
        dir: resolve(root, 'lib'),
        entryFileNames: '[name].cjs.js',
        format: 'cjs',
        globals: { react: 'React' },
        sourcemap: true,
      },
      {
        name: 'dopejs-markdown-editor',
        dir: resolve(root, 'lib'),
        entryFileNames: '[name].es.js',
        format: 'es',
        globals: { react: 'React' },
        sourcemap: true,
        esModule: true,
      },
      {
        name: 'dopejs-markdown-editor',
        dir: resolve(root, 'lib'),
        entryFileNames: '[name].umd.js',
        format: 'umd',
        globals: { react: 'React' },
        sourcemap: true,
      },
    ],
    onwarn(warning, warn) {
      if (warning.message.includes('Package subpath')) {
        return;
      }
      if (warning.message.includes('Use of eval')) {
        return;
      }
      if (warning.message.includes('Circular dependency')) {
        return;
      }
      warn(warning);
    },
    external: ['react', 'react-dom', '@douyinfe/semi-ui', 'react-katex'],
    plugins: [
      peerDepsExternal() as Plugin,
      nodeResolve({ preferBuiltins: true }),
      typescript({
        tsconfig: resolve(root, 'tsconfig.json'),
        sourceMap: true,
        declaration: true,
        declarationDir: resolve(root, 'lib', '.typing.temp'),
        lib: ['ESNext', 'DOM'],
        jsx: 'react-jsx',
      }),
      postcss({
        plugins: [autoprefixer()],
        sourceMap: true,
        extract: true,
        minimize: true,
      }),
      json(),
      terser(),
      cssModules(),
      scss(),
      commonjs({ extensions: ['.js'] }),
      babel({
        babelHelpers: 'runtime',
        exclude: /node_modules/,
        extensions: ['.js', '.ts', '.tsx'],
        presets: [
          '@babel/preset-env',
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
        ],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
    ],
  });
};
