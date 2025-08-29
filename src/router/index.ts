import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: '/jobRecordList',
      name: 'jobRecordList',
      component: () => import('@/views/components/jobRecord/jobRecordList.vue'),
    },
    {
      path: '/jobverify',
      name: 'jobverify',
      component: () => import('@/views/components/jobVerify/jobVerify.vue'),
    },
    {
      path: '/testbnt',
      name: 'testbnt',
      component: () => import('@/views/components/testbnt/testbnt.vue'),
    },
    {
      path: '/home',
      name: 'homepage',
      component: () => import('@/views/Home/index.vue'),
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('@/views/components/message/messageList.vue'),
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: () => import('@/views/components/userInfo/userInfo.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/components/login/login.vue'),
    },
    {
      path: '/addOperator',
      name: 'addOperator',
      component: () => import('@/views/operatorInfo/operator.vue'),
    },
    {
      path: '/operatorList',
      name: 'operatorList',
      component: () => import('@/views/operatorInfo/operatorList.vue'),
    },
    {
      path: '/jobDetail',
      name: 'jobDetail',
      component: () => import('@/views/components/jobDetail/jobDetail.vue'),
    },
    {
      path: '/CardInfoDetail',
      name: 'CardInfoDetail',
      component: () => import('@/views/components/cardInfoDetail/CardInfoDetail.vue'),
    },
    {
      path: '/GroupInfo',
      name: 'GroupInfo',
      component: () => import('@/views/components/GroupInfo/GroupInfo.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/components/testbnt/testbnt.vue'),
    },
    {
      path: '/aihuaPLCZ',
      name: 'aihuaPLCZ',
      component: () => import('@/views/components/aihua/aihuaPLCZ.vue'),
    },
    {
      path: '/jobReport',
      name: 'jobReport',
      component: () => import('@/views/components/jobReport/jobReport.vue'),
    },
    {
      path: '/kaiDanReport',
      name: 'kaiDanReport',
      component: () => import('@/views/components/kaiDanReport/kaiDanReport.vue'),
    },
    {
      path: '/PLCY',
      name: 'PLCY',
      component: () => import('@/views/components/IOTV3/PLCZ/PLCZ.vue'),
    },
    {
      path: '/testSign',
      name: 'testSign',
      component: () => import('@/views/test/testSign.vue'),
    },
        {
      path: '/testPdf',
      name: 'testPdf',
      component: () => import('@/views/test/testpdfabc.vue'),
    },
    {
      path: '/contractUpload',
      name: 'contractUpload',
      component: () => import('@/views/components/websign/contractUpload.vue'),
    },
    {
      path: '/getWebSignUrl',
      name: 'getWebSignUrl',
      component: () => import('@/views/components/websign/getWebSignUrl.vue'),
    },
    {
      path: '/contractwebsign',
      name: 'contractwebsign',
      component: () => import('@/views/components/websign/contractwebsign.vue'),
    },
  
  ],
})

export default router
