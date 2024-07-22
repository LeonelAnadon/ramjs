const CodeMirror = require("./CodeMirror/CodeMirror.js");
module.exports = {
  view: function () {
    return m("main", m("div", [m(CodeMirror)]));
  },
};
