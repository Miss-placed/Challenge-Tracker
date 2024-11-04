import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:game',
      name: 'gameView',
      component: () => import('@/views/GameView.vue'),
    },
    {
      path: '/:game/:gamemode',
      name: 'gamemodeView',
      component: () => import('@/views/GamemodeView.vue'),
    },
    {
      path: '/:game/:gamemode/:category',
      name: 'categoryView',
      component: () => import('@/views/CategoryView.vue'),
    },
    {
      path: '/:game/:gamemode/:category/:subcategory',
      name: 'subcategoryView',
      component: () => import('@/views/SubcategoryView.vue'),
    },
  ],
})

export default router
