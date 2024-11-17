export default {
  mount: { src: "/" },
  plugins: [ "@snowpack/plugin-typescript" ],
  routes: [
    {
      match: "routes",
      src: "/",
      dest: "/pages/home/index.html"
    }
  ]
};