import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/LoginPage.vue'
import Dashboard from '../components/UserDashboard.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/signup', component: SignupPage },
  { path: '/login', component: LoginPage },
  { 
    path: '/dashboard', 
    component: UserDashboard,
    meta: { requiresAuth: true }
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