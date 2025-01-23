import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import { builtinModules as nodeBuiltinModules } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'rollup';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json' assert { type: 'json' };

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
        name: 'dme-markdown-editor',
        dir: resolve(root, 'lib'),
        entryFileNames: '[name].cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        name: 'dme-markdown-editor',
        dir: resolve(root, 'lib'),
        entryFileNames: '[name].es.js',
        format: 'es',
        sourcemap: true,
        esModule: true,
      },
      // {
      //   name: 'dme-markdown-editor',
      //   dir: resolve(root, 'lib'),
      //   entryFileNames: '[name].umd.js',
      //   format: 'umd',
      //   globals: { react: 'React', 'react-dom': 'ReactDOM', 'react/jsx-runtime': 'jsxRuntime' },
      //   sourcemap: true,
      // },
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
    external: [
      ...nodeBuiltinModules,
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
      ...Object.keys(pkg.devDependencies),
      'react',
      'react-dom',
    ],
    plugins: [
      peerDepsExternal() as Plugin,
      nodeResolve({ preferBuiltins: true }),
      typescript({
        tsconfig: resolve(root, 'tsconfig.base.json'),
        sourceMap: true,
        declaration: true,
        declarationDir: resolve(root, 'lib', '.typing.temp'),
        target: 'ES6',
        lib: ['ESNext', 'DOM'],
        jsx: 'react-jsx',
      }),
      postcss({
        extensions: ['.css', '.scss'],
        plugins: [autoprefixer()],
        sourceMap: true,
        extract: resolve(root, 'lib', 'style.css'),
        minimize: true,
        use: { sass: { silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin'] }, stylus: {}, less: {} },
      }),
      json(),
      terser(),
      commonjs({ extensions: ['.js'] }),
      babel({
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
      }),
      copy({ targets: [{ src: resolve(root, '..', '..', 'assets', 'fonts'), dest: resolve(root, 'lib') }] }),
    ],
  });
};
