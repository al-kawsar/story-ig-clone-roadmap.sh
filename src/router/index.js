import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";

const Dashboard = () => import("@/views/Dashboard.vue");
const DetailStory = import("@/views/DetailStory.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Dashboard,
    },
    {
      path: "/stories/:username/:storyId",
      name: "detail",
      component: DetailStory,
    },
  ],
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

// Stop NProgress after each route change
router.afterEach(() => {
  NProgress.done();
});

export default router;
