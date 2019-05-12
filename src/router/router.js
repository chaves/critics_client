import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import TweetsListe from "@/components/TweetsListe";

const routes = [
  {
    path: "/",
    component: TweetsListe
  }
];

const router = new VueRouter({
  routes, // short for `routes: routes`,
  hashbang: false,
  mode: "history"
});

export default router;
