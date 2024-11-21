import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";

export default {
  view: function () {
    return m("div#app", [m(Header), m(Content), m(Footer)]);
  },
};
