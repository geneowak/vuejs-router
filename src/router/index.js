import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";
import ExperienceDetails from "../views/ExperienceDetails";
import store from "@/store.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
  {
    path: "/destination/:slug",
    name: "DestinationDetails",
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "destinationDetails" */ "../views/DestinationDetails"
      ),
    children: [
      {
        path: ":experienceSlug",
        name: "experienceDetails",
        props: true,
        component: ExperienceDetails,
      },
    ],
    beforeEnter: (to, from, next) => {
      const exists = store.destinations.find(
        (destination) => destination.slug === to.params.slug
      );
      if (exists) {
        return next();
      }
      return next({ name: "404" });
    },
  },
  {
    path: "/user",
    name: "user",
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "User" */ "../views/User"),
  },
  {
    path: "/invoices",
    name: "invoices",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "Invoices" */ "../views/Invoices"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "Login" */ "../views/Login"),
  },
  {
    path: "/404",
    alias: "*",
    name: "404",
    props: true,
    component: () => import(/* webpackChunkName: "404" */ "../views/404"),
  },
];

const router = new VueRouter({
  linkExactActiveClass: "hello-active-class",
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    const position = {};
    if (to.hash) {
      position.selector = to.hash;
      if (to.hash === "#experience") {
        position.offset = { y: 140 };
      }
      if (document.querySelector(to.hash)) {
        return position;
      }
      return false;
    }
  },
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.user) {
      return next({ name: "login", query: { redirect: to.fullPath } });
    }
  }

  return next();
});

export default router;
