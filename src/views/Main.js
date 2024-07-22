const Content = require("./Content");
const Header = require("./Header");
const Footer = require("./Footer");

module.exports = {
  view: function () {
    return m("div#app", [m(Header), m(Content), m(Footer)]);
  },
};
