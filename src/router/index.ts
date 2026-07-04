import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Auth',
    component: () => import('@/views/auth/AuthView.vue'),
    meta: { title: '登录', hideSidebar: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    redirect: '/assistant',
    children: [
      {
        path: 'assistant',
        name: 'Assistant',
        component: () => import('@/views/assistant/AssistantView.vue'),
        meta: { title: 'AI 助手', icon: 'ChatDotRound' },
      },
      {
        path: 'academics',
        name: 'Academics',
        component: () => import('@/views/academics/AcademicsView.vue'),
        meta: { title: '学业管理', icon: 'Reading' },
      },
      {
        path: 'campus',
        name: 'Campus',
        component: () => import('@/views/campus/CampusView.vue'),
        meta: { title: '校园信息', icon: 'OfficeBuilding' },
      },
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('@/views/finance/FinanceView.vue'),
        meta: { title: '财务管理', icon: 'Money' },
      },
      {
        path: 'lost-found',
        name: 'LostFound',
        component: () => import('@/views/lost-found/LostFoundView.vue'),
        meta: { title: '失物招领', icon: 'Search' },
      },
      {
        path: 'marketplace',
        name: 'Marketplace',
        component: () => import('@/views/marketplace/MarketplaceView.vue'),
        meta: { title: '二手市场', icon: 'ShoppingCart' },
      },
      {
        path: 'qa',
        name: 'QA',
        component: () => import('@/views/qa/QAView.vue'),
        meta: { title: '问答广场', icon: 'ChatLineSquare' },
      },
      {
        path: 'social',
        name: 'Social',
        component: () => import('@/views/social/SocialView.vue'),
        meta: { title: '社交通讯', icon: 'User' },
      },
      {
        path: 'health',
        name: 'Health',
        component: () => import('@/views/health/HealthView.vue'),
        meta: { title: '健康管理', icon: 'FirstAidKit' },
      },
      {
        path: 'volunteer',
        name: 'Volunteer',
        component: () => import('@/views/volunteer/VolunteerView.vue'),
        meta: { title: '志愿公益', icon: 'Heart' },
      },
      {
        path: 'points',
        name: 'Points',
        component: () => import('@/views/points/PointsView.vue'),
        meta: { title: '积分中心', icon: 'Medal' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人资料', icon: 'UserFilled' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  document.title = title ? `${title} - CampusLife` : 'CampusLife'
  next()
})

export default router
