import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import AnalysisView from '../views/analyzePage/AnalysisView.vue'
const hash = createWebHashHistory()
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: hash,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/analyze',
      name: "AnalysisView",
      component: AnalysisView
    }
  ]
})

export default router
