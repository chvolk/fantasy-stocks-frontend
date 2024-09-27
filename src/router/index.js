import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import LandingPage from '@/components/LandingPage.vue'
import SignupPage from '@/components/SignupPage.vue'
import UserDashboard from '@/components/UserDashboard.vue'
import LeaguesPage from '@/components/LeaguesPage.vue'
import LoginPage from '@/components/LoginPage.vue'
import StockDraft from '@/components/StockDraft.vue'
import Leaderboard from '@/components/Leaderboard.vue'

const routes = [
  {
    path: '/',
    component: LandingPage,
    meta: { title: 'Moq Exchange - Home' }
  },
  { path: '/signup', component: SignupPage },
  { path: '/login', component: LoginPage },
  { 
    path: '/dashboard', 
    component: UserDashboard,
    meta: { title: 'Moq Exchange - Dashboard', requiresAuth: true }
  },
  { 
    path: '/leagues', 
    component: LeaguesPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/draft', 
    component: StockDraft,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Moq Exchange'
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router