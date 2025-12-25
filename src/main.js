import "./assets/main.css";
import "nprogress/nprogress.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { createApp } from "vue";
import VueVirtualScroller from "vue-virtual-scroller";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(VueVirtualScroller);

app.mount("#app");
