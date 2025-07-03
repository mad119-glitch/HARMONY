import { createRouter, createWebHistory } from 'vue-router'

// View Components
import Login from '../views/Login.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import DoctorDashboard from '../views/DoctorDashboard.vue'
import NurseDashboard from '../views/NurseDashboard.vue'
import PharmacistDashboard from '../views/PharmacistDashboard.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/admin-dashboard', component: AdminDashboard },
  { path: '/doctor-dashboard', component: DoctorDashboard },
  { path: '/nurse-dashboard', component: NurseDashboard },
  { path: '/pharmacist-dashboard', component: PharmacistDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
