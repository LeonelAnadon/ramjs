module.exports = {
  oninit: (vnode) => {
    vnode.state.currentYear = new Date().getFullYear();
  },
  view: function (vnode) {
    return m(
      "footer",
      m("div", [
        m(
          "p",
          `Todos los derechos reservados ${vnode.state.currentYear} | Hecho con ♥️ por Leonel Anadón`
        ),
      ])
    );
  },
};
