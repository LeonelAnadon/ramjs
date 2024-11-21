import { defineConfig } from "vite";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  resolve: {
    alias: {
      m: "mithril",
    },
  },
  plugins: [
    monacoEditorPlugin({
      languageWorkers: [
        "editorWorkerService",
        "json",
        "css",
        "html",
        "typescript",
      ],
    }),
  ],
  build: {
    outDir: "dist",
    cssCodeSplit: true,
    minify: "terser",
    terserOptions: {
      compress: {
        evaluate: false, 
      },
      mangle: false,
      keep_classnames: true,
      keep_fnames: true,
    },
  },
});
