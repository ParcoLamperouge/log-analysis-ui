import { createRouter, createWebHistory } from 'vue-router'
import DropView from '../views/DropView.vue';
import Analyze from '../views/analyzePage/Analyze.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DropView
    },
    {
      path: '/analyze',
      name: "Analyze",
      component: Analyze
    }
  ]
})

export default router
