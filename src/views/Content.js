import CodeMirror from "./CodeMirror/CodeMirror.js";

export default {
  view: function () {
    return m("main", m("div", 
      [m(CodeMirror)]
    ));
  },
};
