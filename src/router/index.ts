import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: '首页',
      },
      component: () => import('../views/components/login/login.vue'),
    },
    {
      path: '/myjobs',
      name: 'myjobs',
      meta: {
        title: '我的任务',
      },
      component: () => import('@/views/components/myJob/myJob.vue'),
    },
    {
      path: '/assignjob',
      name: 'assignjob',
      meta: {
        title: '任务分配',
      },
      component: () => import('@/views/components/assignJob/assignJob.vue'),
    },
    {
      path: '/joblist',
      name: 'joblist',
      meta: {
        title: '任务列表',
      },
      component: () => import('@/views/components/jobList/jobList.vue'),
    },
    {
      path: '/jobrecord',
      name: 'jobrecord',
      meta: {
        title: '任务记录',
      },
      component: () => import('@/views/components/jobRecord/jobRecord.vue'),
    },
    {
      path: '/jobRecordList',
      name: 'jobRecordList',
      meta: {
        title: '任务记录列表',
      },
      component: () => import('@/views/components/jobRecord/jobRecordList.vue'),
    },
    {
      path: '/jobverify',
      name: 'jobverify',
      meta: {
        title: '任务审核',
      },  
      component: () => import('@/views/components/jobVerify/jobVerify.vue'),
    },
    {
      path: '/testbnt',
      name: 'testbnt',
      meta: {
        title: '测试按钮',
      },
      component: () => import('@/views/components/testbnt/testbnt.vue'),
    },
    {
      path: '/home',
      name: 'homepage',
      meta: {
        title: '首页',
      },
      component: () => import('@/views/Home/index.vue'),
    },
    {
      path: '/message',
      name: 'message',
      meta: {
        title: '消息列表',
      },
      component: () => import('@/views/components/message/messageList.vue'),
    },
    {
      path: '/userinfo',
      name: 'userinfo', 
      meta: {
        title: '用户信息',
      },
      component: () => import('@/views/components/userInfo/userInfo.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
      },
      component: () => import('@/views/components/login/login.vue'),
    },
    {
      path: '/addOperator',
      name: 'addOperator',
      meta: {
        title: '添加操作员',
      },
      component: () => import('@/views/operatorInfo/operator.vue'),
    },
    {
      path: '/operatorList',
      name: 'operatorList', 
      meta: {
        title: '操作员列表',
      },
      component: () => import('@/views/operatorInfo/operatorList.vue'),
    },
    {
      path: '/jobDetail',
      name: 'jobDetail',
      meta: {
        title: '任务详情',
      },
      component: () => import('@/views/components/jobDetail/jobDetail.vue'),
    },
    {
      path: '/CardInfoDetail',
      name: 'CardInfoDetail',
      meta: {
        title: '卡片详情',
      },
      component: () => import('@/views/components/cardInfoDetail/CardInfoDetail.vue'),
    },
    {
      path: '/GroupInfo',
      name: 'GroupInfo',
      meta: {
        title: '分组详情',
      },
      component: () => import('@/views/components/GroupInfo/GroupInfo.vue'),
    },
    {
      path: '/test',
      name: 'test',
      meta: {
        title: '测试按钮',
      },
      component: () => import('@/views/components/testbnt/testbnt.vue'),
    },
    {
      path: '/aihuaPLCZ',
      name: 'aihuaPLCZ',
      meta: {
        title: '大华查询',
      },
      component: () => import('@/views/components/aihua/aihuaPLCZ.vue'),
    },
    {
      path: '/jobReport',
      name: 'jobReport',
      meta: {
        title: '任务报告',
      },
      component: () => import('@/views/components/jobReport/jobReport.vue'),
    },
    {
      path: '/kaiDanReport',
      name: 'kaiDanReport',
      meta: {
        title: '开单报告',
      },
      component: () => import('@/views/components/kaiDanReport/kaiDanReport.vue'),
    },
    {
      path: '/PLCY',
      name: 'PLCY',
      meta: {
        title: '批量充值',
      },
      component: () => import('@/views/components/IOTV3/PLCZ/PLCZ.vue'),
    },
    {
      path: '/testSign',
      name: 'testSign',
      meta: {
        title: '测试签名',
      },
      component: () => import('@/views/test/testSign.vue'),
    },
        {
      path: '/testPdf',
      name: 'testPdf',
      meta: {
        title: '测试PDF',
      },
      component: () => import('@/views/test/testpdfabc.vue'),
    },
    {
      path: '/contractUpload',
      name: 'contractUpload',
      meta: {
        title: '合同上传',
      },
      component: () => import('@/views/components/websign/contractUpload.vue'),
    },
    {
      path: '/getWebSignUrl',
      name: 'getWebSignUrl',
      meta: {
        title: '获取签名URL',
      },
      component: () => import('@/views/components/websign/getWebSignUrl.vue'),
    },
    {
      path: '/contractwebsign',
      name: 'contractwebsign',
      meta: {
        title: '合同签名',
      },
      component: () => import('@/views/components/websign/contractwebsign.vue'),
    },
    {
      path: '/contractList',
      name: 'contractList',
      meta: {
        title: '合同列表',
      },
      component: () => import('@/views/components/websign/contractList.vue'),
    },
    {
      path: '/authoritySel',
      name: 'authoritySel',
      meta: {
        title: '权限选择',
      },
      component: () => import('@/views/operatorInfo/authoritySel.vue'),
    },

    {
        path: '/roleSetup',
        name: 'roleSetup',
        meta: {
          title: '角色设置',
        },
        component: () => import('@/views/operatorInfo/roleSetup.vue'),
      },
      {
        path: '/routeMetaDemo',
        name: 'routeMetaDemo',
        meta: {
          title: '路由Meta示例',
          requiresAuth: true,
          transition: 'fade'
        },
        component: () => import('@/views/test/RouteMetaDemo.vue'),
      },

  ],
})

// 全局前置路由守卫 - 演示如何在守卫中访问meta信息
router.beforeEach((to, from, next) => {
  // 访问目标路由的meta信息
  console.log('路由守卫 - 目标路由:', to.path);
  console.log('路由守卫 - Meta信息:', to.meta);
  
  // 示例1: 根据meta.title设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
    console.log('路由守卫 - 设置页面标题:', to.meta.title);
  }
  
  // 示例2: 检查权限要求
  if (to.meta.requiresAuth) {
    // 这里可以添加检查用户是否登录的逻辑
    console.log('路由守卫 - 该页面需要身份验证');
    // 假设已经登录，可以继续访问
  }
  
  // 示例3: 处理过渡动画
  if (to.meta.transition) {
    // 可以根据meta中的过渡配置设置不同的过渡效果
    console.log('路由守卫 - 页面过渡效果:', to.meta.transition);
  }
  
  // 继续路由跳转
  next();
});

// 全局后置钩子 - 也可以访问meta信息
router.afterEach((to, from) => {
  console.log('路由已跳转:', to.path, 'Meta信息:', to.meta);
});

export default router
