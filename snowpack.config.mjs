export default {
  mount: { src: "/" },
  plugins: [ "@snowpack/plugin-typescript" ],
  routes: [
    { match: "routes", src: "/", dest: "/pages/home/index.html" },
    { match: "routes", src: "/login", dest: "/pages/login/index.html" },
    { match: "routes", src: "/register", dest: "/pages/register/index.html" },
    { match: "routes", src: ".*", dest: "/pages/errors/404.html" }
  ]
};