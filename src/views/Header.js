import CodeMirror from "./CodeMirror/CodeMirror";

export default {
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
        m("h1", [
          m("img", { src: "/assets/apple-touch-icon.png", width: 100 }),
          m("span", "RamJS"),
        ]),
        m("div.btn__cont", [
          m("button", { onclick: CodeMirror.triggerUpdateConsole }, [
            m("p", "RUN"),
            m("div.keys", [m("span", "Ctrl+S")]),
          ]),
          m("button", { onclick: CodeMirror.triggerCleanup }, "Limpiar"),
        ]),
      ])
    );
  },
};
