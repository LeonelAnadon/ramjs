const CodeMirror = require("./CodeMirror/CodeMirror");

module.exports = {
  oninit: function (_) {
    document.addEventListener("keydown", this.handleKeyDown);
  },
  onremove: function (_) {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  handleKeyDown: function (event) {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      CodeMirror.updateConsole();
    }
  },
  view: function () {
    return m(
      "header",
      m("div", [
        m("h1", [m('img', {src: './src/assets/svg (1).svg', width: 100}),m("span", "RamJS")]),
        m("div.btn__cont", [
          m("button", { onclick: CodeMirror.triggerUpdateConsole }, [
            m("p", "RUN 🌀"),
            m("div.keys", [m("span", "Ctrl"), m("span", "S")]),
          ]),
          m("button", { onclick: CodeMirror.triggerCleanup }, "Limpiar"),
        ]),
      ])
    );
  },
};
