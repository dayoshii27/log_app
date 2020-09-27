import { createApp } from "vue";
import App from "./App.vue";
// import router from "./router";
// import store from "./store";
require("@/scss/reset.scss");
require("@/scss/main.scss");

createApp(App)
  // .use(store)
  // .use(router)
  .mount("#app");
