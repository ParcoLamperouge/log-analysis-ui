import { createRouter, createWebHistory } from 'vue-router'
import DropView from '../views/DropView.vue';
import LogView from '../views/LogView/LogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DropView
    },
    {
      path: '/log',
      name: "logView",
      component: LogView
    }
  ]
})

export default router
