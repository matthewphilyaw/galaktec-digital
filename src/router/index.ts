import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import galaktecDigitalVm from '../views/GalaktecDigitalVm.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'GalaktechDigitalVm',
    component: galaktecDigitalVm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
