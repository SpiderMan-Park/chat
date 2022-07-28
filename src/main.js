import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/fonts/iconfont.css";
// 配置element-ui
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

// 注册全局Socket方法
import Socket from "./scripts/Socket";
Vue.prototype.$Socket = Socket;

import fileUpload from "./scripts/uploadFile";
Vue.prototype.$fileUpload = fileUpload;

// js文件和vue文件数据通信
import bus from "@/utils/bus";
Vue.prototype.$bus = bus;
const electron = window.require("electron");
Vue.prototype.$electron = electron;

import "./assets/style/scrollbar.css";

// 读取本地配置文件 config.conf
const fs = window.require("fs");
const configPath = "config.conf";
var prodConfig = fs.readFileSync(configPath, "utf-8");
prodConfig = JSON.parse(prodConfig);
console.log(prodConfig);
var devConfig = {
  PORT: 8666,
  // HOST: "192.168.1.16",
  HOST: "101.34.42.124",
};
if (process.env.NODE_ENV == "production") {
  Vue.prototype.$systemConfig = prodConfig;
} else {
  Vue.prototype.$systemConfig = devConfig;
}

Vue.config.productionTip = false;
Vue.use(ElementUI);
import { message } from "./utils/resetMessage";
Vue.prototype.$message = message;

Vue.prototype.$bc = new BroadcastChannel("closeNotify");
Vue.prototype.$bc1 = new BroadcastChannel("sendPos");
Vue.prototype.$bc2 = new BroadcastChannel("sendOnlineList");
Vue.prototype.$bc3 = new BroadcastChannel("exit");
// 引入字体
import "./assets/fonts/NotoSansSC-Medium.otf";
// 防止el-button重复点击
// eslint-disable-next-line
Vue.directive("preventReClick", {
  // eslint-disable-next-line
  inserted(el, binding) {
    // eslint-disable-next-line
    el.addEventListener("click", () => {
      // eslint-disable-next-line
      if (!el.disabled) {
        // eslint-disable-next-line
        el.disabled = true;
        // eslint-disable-next-line
        setTimeout(() => {
          // eslint-disable-next-line
          el.disabled = false;
          // eslint-disable-next-line
        }, binding.value || 1200);
      }
    });
  },
});

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
