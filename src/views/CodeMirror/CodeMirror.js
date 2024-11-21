import * as monaco from "monaco-editor";

const rules = [
  { token: "keyword", foreground: "ff79c6" }, // Keywords (magenta)
  { token: "number", foreground: "f1fa8c" }, // Numbers and Booleans (yellow)
  { token: "variable.parameter", foreground: "f8f8f2" }, // Function parameters (light gray)
  { token: "variable", foreground: "f8f8f2" }, // Variables (light gray)
  { token: "string", foreground: "f1fa8c" }, // Strings (yellow)
  { token: "key", foreground: "50fa7b" }, // Object literal keys (green)
  { token: "regexp", foreground: "ffb86c" }, // Regex literals (orange)
  { token: "type", foreground: "8be9fd" }, // Types (cyan)
  { token: "property", foreground: "bd93f9" }, // Object properties (light purple)
  { token: "function", foreground: "8be9fd" }, // Function names (cyan)
  { token: "keyword.control", foreground: "ff79c6" }, // Control keywords (magenta)
  { token: "variable.other", foreground: "f8f8f2" }, // Other variables (light gray)
  { token: "foreground", foreground: "f8f8f2" }, // Editor foreground (light gray)
  { token: "text", foreground: "f8f8f2" }, // Text (light gray)
  { token: "comment", foreground: "6272a4" }, // Comments (blue-gray)
  { token: "delimiter", foreground: "f8f8f2" }, // Delimiters (light gray)
];

const colors = {
  "editor.background": "#282a36", // Background (dark purple)
  "editor.foreground": "#f8f8f2", // Foreground (light gray)
  "editorLineNumber.foreground": "#6272a4", // Line numbers (blue-gray)
  "editorLineNumber.activeForeground": "#f8f8f2", // Active line number (light gray)
  "editorCursor.foreground": "#f8f8f2", // Cursor (light gray)
  "editor.selectionBackground": "#44475a", // Selection (dark gray)
  "editor.inactiveSelectionBackground": "#44475a", // Inactive selection (dark gray)
  "editor.wordHighlightBackground": "#44475a", // Word highlight (dark gray)
  "editor.wordHighlightStrongBackground": "#44475a", // Strong word highlight (dark gray)
  "editor.findMatchBackground": "#ff79c6", // Find match (magenta)
  "editor.findMatchHighlightBackground": "#ff79c6", // Find match highlight (magenta)
  "editor.findRangeHighlightBackground": "#ff79c6", // Find range highlight (magenta)
  "editor.hoverHighlightBackground": "#ff79c6", // Hover highlight (magenta)
  "editor.lineHighlightBackground": "#282a36", // Line highlight (dark gray)
  "editor.lineHighlightBorder": "#282a36", // Line highlight border (dark gray)
  "editorIndentGuide.background": "#6272a4", // Indentation guide (blue-gray)
  "editorIndentGuide.activeBackground": "#ff79c6", // Active indentation guide (magenta)
  "editorWhitespace.foreground": "#6272a4", // Whitespace (blue-gray)
  "editorBracketMatch.background": "#6272a4", // Bracket match (blue-gray)
  "editorBracketMatch.border": "#6272a4", // Bracket match border (blue-gray)
  "editorGutter.background": "#282a36", // Gutter (dark purple)
  "editorGutter.modifiedBackground": "#ffb86c", // Modified gutter (orange)
  "editorGutter.addedBackground": "#50fa7b", // Added gutter (green)
  "editorGutter.deletedBackground": "#ff5555", // Deleted gutter (red)
  "editorOverviewRuler.modifiedForeground": "#ffb86c", // Modified overview (orange)
  "editorOverviewRuler.addedForeground": "#50fa7b", // Added overview (green)
  "editorOverviewRuler.deletedForeground": "#ff5555", // Deleted overview (red)
  "editorOverviewRuler.errorForeground": "#ff5555", // Error overview (red)
  "editorOverviewRuler.warningForeground": "#f1fa8c", // Warning overview (yellow)
  "editorOverviewRuler.infoForeground": "#8be9fd", // Info overview (cyan)
  "editorError.foreground": "#ff5555", // Error text (red)
  "editorWarning.foreground": "#f1fa8c", // Warning text (yellow)
  "editorInfo.foreground": "#8be9fd", // Info text (cyan)
  "editorHint.foreground": "#50fa7b", // Hint text (green)
  "editorMarkerNavigation.background": "#282a36", // Marker navigation background (dark purple)
  "editorMarkerNavigationError.background": "#ff5555", // Marker navigation error (red)
  "editorMarkerNavigationWarning.background": "#f1fa8c", // Marker navigation warning (yellow)
  "editorMarkerNavigationInfo.background": "#8be9fd", // Marker navigation info (cyan)
};

const Monaco = {
  editor: null,
  outputConsole: null,
  oncreate: (vnode) => {
    monaco.editor.defineTheme("default", {
      base: "vs-dark",
      inherit: true,
      rules,
      colors,
    });
    monaco.editor.setTheme("default");
    const draft = localStorage.getItem("draft");
    const value =
      vnode.attrs.value ||
      draft ||
      '// Escribí tu código acá\nconsole.log("Hola, Mundo!");';
    Monaco.editor = vnode.state.editor = monaco.editor.create(
      document.getElementById("editor"),
      {
        value,
        language: "javascript",
        fontSize: 18,
        automaticLayout: true,
      }
    );
    Monaco.consoleOutput = monaco.editor.create(
      document.getElementById("output"),
      {
        value: "Consola...",
        language: "json",
        formatting: true,
        formatOnPaste: true,
        formatOnType: true,
        fontSize: 18,
        readOnly: true,
        automaticLayout: true,
        lineNumbers: "off",
        minimap: { enabled: false },
        tabSize: 2,
        wordWrap: "on",
      }
    );
  },
  removeErrors() {
    document.querySelector("#mocha-error").remove();
  },
  async runInSandbox(code) {
    return new Promise((resolve, reject) => {
      try {
        let items = [];
        mocha.setup({
          ui: "bdd",
          cleanReferencesAfterRun: false,
        });

        mocha.suite.suites = [];

        describe("Evaluación de código", function () {
          it("Testing...", function (done) {
            try {
              const codigo = code;
              eval(codigo);
              done();
            } catch (error) {
              console.log(`Error: ${error?.message || "..."}`);
              done();
            }
          });
        });

        let consoleOutput = [];

        const originalConsoleLog = console.log;
        console.log = function (...args) {
          consoleOutput.push(args);
          originalConsoleLog.apply(console, args);
        };

        mocha
          .run()
          .once("end", () => {
            let flattened = consoleOutput.flat();
            items = flattened.map((x) => JSON.stringify(x, null, 2));
            console.log(items);
            items = items?.join("\n\r");
            m.redraw();
            resolve(items);
            mocha.suite.suites = [];
            mocha.suite.removeAllListeners();
            Monaco.removeErrors();
          })
          .once("fail", (test, err) => {
            console.log("has failed");
            reject(err);
            mocha.suite.suites = [];
            mocha.suite.removeAllListeners();
            Monaco.removeErrors();
          });
      } catch (error) {
        reject(error);
      }
    });
  },

  updateConsole: async () => {
    if (Monaco.editor && Monaco.consoleOutput) {
      try {
        const code = Monaco.editor.getValue();
        const r = await Monaco.runInSandbox(code);
        localStorage.setItem("draft", code);
        Monaco.consoleOutput.setValue("", "auto");
        Monaco.consoleOutput.setValue(r, "auto");
      } catch (error) {
        console.log(error);
        Monaco.consoleOutput.setValue(`Algo salió mal, por favor recargar.`);
      }
    }
  },

  triggerUpdateConsole: () => {
    Monaco.updateConsole();
  },
  triggerCleanup: () => {
    Monaco.consoleOutput.setValue("", "auto");
    Monaco.editor.setValue("", "auto");
  },

  view: (vnode) => {
    return m("section.codebox", [
      m("div", { id: "editor", style: { height: "85vh", width: "100%" } }),
      m("div", { id: "output", style: { height: "85vh", width: "100%" } }),
      // m("div.console__cont", [
      //   m("p", "Consola 💨"),
      //   m("div.console__re", { id: "output", style: { height: "70vh", width: "100%" } }),
      // ]),
    ]);
  },
};

export default Monaco;
