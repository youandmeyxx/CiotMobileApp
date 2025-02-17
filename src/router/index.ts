import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/index.vue'),
    },
    {
      path: '/myjobs',
      name: 'myjobs',
      component: () => import('@/views/components/myJob/myJob.vue'),
    },
    {
      path: '/assignjob',
      name: 'assignjob',
      component: () => import('@/views/components/assignJob/assignJob.vue'),
    },
    {
      path: '/joblist',
      name: 'joblist',
      component: () => import('@/views/components/jobList/jobList.vue'),
    },
    {
      path: '/jobrecord',
      name: 'jobrecord',
      component: () => import('@/views/components/jobRecord/jobRecord.vue'),
    },
    {
      path: '/jobverify',
      name: 'jobverify',
      component: () => import('@/views/components/jobVerify/jobVerify.vue'),
    },
  ],
})

export default router
