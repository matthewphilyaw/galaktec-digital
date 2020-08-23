import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import galaktecDigitalVm from '../views/galaktec-digital-vm.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'galaktech-digital-vm',
    component: galaktecDigitalVm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
