import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupPage.vue'),
    },
    {
      path: '/learn-more',
      name: 'learn-more',
      component: () => import('@/views/LearnMorePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
    }
  ],
})

export default router
