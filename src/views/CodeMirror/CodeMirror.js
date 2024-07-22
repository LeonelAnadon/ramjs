const monaco = require("monaco-editor");

const rules = [
  { token: "keyword", foreground: "f7768e" }, // This keyword, HTML elements, Regex group symbol, CSS units, Terminal Red
  { token: "number", foreground: "ff9e64" }, // Number and Boolean constants, Language support constants
  { token: "variable.parameter", foreground: "e0af68" }, // Function parameters, Regex character sets, Terminal Yellow
  { token: "variable", foreground: "cfc9c2" }, // Parameters inside functions (semantic highlighting only)
  { token: "string", foreground: "9ece6a" }, // Strings, CSS class names
  { token: "key", foreground: "73daca" }, // Object literal keys, Markdown links, Terminal Green
  { token: "regexp", foreground: "b4f9f8" }, // Regex literal strings
  { token: "type", foreground: "2ac3de" }, // Language support functions, CSS HTML elements
  { token: "property", foreground: "7dcfff" }, // Object properties, Regex quantifiers and flags, Markdown headings, Terminal Cyan, Markdown code, Import/export keywords
  { token: "function", foreground: "7aa2f7" }, // Function names, CSS property names, Terminal Blue
  { token: "keyword.control", foreground: "bb9af7" }, // Control Keywords, Storage Types, Regex symbols and operators, HTML Attributes, Terminal Magenta
  { token: "variable.other", foreground: "c0caf5" }, // Variables, Class names, Terminal White
  { token: "foreground", foreground: "a9b1d6" }, // Editor Foreground
  { token: "text", foreground: "9aa5ce" }, // Markdown Text, HTML Text
  { token: "comment", foreground: "565f89" }, // Comments
  { token: "delimiter", foreground: "414868" }, // Terminal Black
];
const colors = {
  "editor.background": "#1a1b26", // Editor Background (Night)
  "editor.foreground": "#a9b1d6", // Editor Foreground
  "editorLineNumber.foreground": "#737aa2",
  "editorLineNumber.activeForeground": "#c0caf5",
  "editorCursor.foreground": "#c0caf5",
  "editor.selectionBackground": "#33467c",
  "editor.inactiveSelectionBackground": "#1a1b26",
  "editor.wordHighlightBackground": "#3d59a1",
  "editor.wordHighlightStrongBackground": "#3d59a1",
  "editor.findMatchBackground": "#3d59a1",
  "editor.findMatchHighlightBackground": "#3d59a1",
  "editor.findRangeHighlightBackground": "#3d59a1",
  "editor.hoverHighlightBackground": "#3d59a1",
  "editor.lineHighlightBackground": "#1a1b26",
  "editor.lineHighlightBorder": "#1a1b26",
  "editorIndentGuide.background": "#3b4261",
  "editorIndentGuide.activeBackground": "#3b4261",
  "editorWhitespace.foreground": "#3b4261",
  "editorBracketMatch.background": "#3b4261",
  "editorBracketMatch.border": "#3b4261",
  "editorGutter.background": "#1a1b26",
  "editorGutter.modifiedBackground": "#3b4261",
  "editorGutter.addedBackground": "#3b4261",
  "editorGutter.deletedBackground": "#3b4261",
  "editorOverviewRuler.modifiedForeground": "#3b4261",
  "editorOverviewRuler.addedForeground": "#3b4261",
  "editorOverviewRuler.deletedForeground": "#3b4261",
  "editorOverviewRuler.errorForeground": "#db4b4b",
  "editorOverviewRuler.warningForeground": "#e0af68",
  "editorOverviewRuler.infoForeground": "#0db9d7",
  "editorError.foreground": "#db4b4b",
  "editorWarning.foreground": "#e0af68",
  "editorInfo.foreground": "#0db9d7",
  "editorHint.foreground": "#1abc9c",
  "editorMarkerNavigation.background": "#1a1b26",
  "editorMarkerNavigationError.background": "#db4b4b",
  "editorMarkerNavigationWarning.background": "#e0af68",
  "editorMarkerNavigationInfo.background": "#0db9d7",
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
    Monaco.editor = vnode.state.editor = monaco.editor.create(
      document.getElementById("editor"),
      {
        value:
          vnode.attrs.value ||
          '// Escribí tu código acá\nconsole.log("Hola, Mundo!");',
        language: "javascript",
        fontSize: 18,
        automaticLayout: true,
      }
    );
    Monaco.consoleOutput = monaco.editor.create(
      document.getElementById("output"),
      {
        value: "",
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
            items = flattened.map((x) => JSON.stringify(x, null, 0));
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
    return m("section", [
      m("div", { id: "editor", style: { height: "400px" } }),
      m("div.console__cont", [
        m("p", "Consola 💨"),
        m("div.console__re", { id: "output", style: { height: "300px" } }),
      ]),
    ]);
  },
};

module.exports = Monaco;
