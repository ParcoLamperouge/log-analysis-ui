import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue';
import AnalysisView from '../components/analyzePage/AnalysisView.vue'
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
