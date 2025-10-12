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
    },
    {
      path: '/food-questionnaire',
      name: 'food-questionnaire',
      component: () => import('@/views/FoodQuestionnaire.vue'),
    },
    {
      path: '/my-profile',
      name: 'my-profile',
      component: () => import('@/views/MyProfile.vue'),
    },
    {
      path: '/food-log',
      name: 'food-log',
      component: () => import('@/views/FoodLog.vue'),
    },
    {
      path: '/add-food',
      name: 'add-food',
      component: () => import('@/views/AddFood.vue'),
    }
  ],
})

export default router
