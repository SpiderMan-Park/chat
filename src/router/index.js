import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/homeView.vue";
import LoginChat from "../views/login.vue";
import RegisterChat from "../views/register.vue";
import ShowOnlineList from "../views/showOnlineList.vue";

Vue.use(VueRouter);

// 路由重复
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const routes = [
  {
    path: "/home",
    name: "HomeView",
    component: HomeView,
    meta: {
      index: 3,
    },
  },
  {
    path: "/",
    name: "LoginChat",
    component: LoginChat,
    meta: {
      index: 1,
    },
  },
  {
    path: "/register",
    name: "RegisterChat",
    component: RegisterChat,
    meta: {
      index: 2,
    },
  },
  {
    path: "/showOnlineList",
    name: "ShowOnlineList",
    component: ShowOnlineList,
    meta: {
      index: 4,
    },
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];

const router = new VueRouter({
  routes,
});

export default router;
