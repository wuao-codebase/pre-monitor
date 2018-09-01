import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import MonitreportTotal from '@/components/monitreport/total'
import MonitreportDetailed from '@/components/monitreport/detailed'

import SrpList from '@/components/srp/list'
import SrpListadd from '@/components/srp/listadd'
import SrpListedit from '@/components/srp/listedit'

import SrpMonitlist from '@/components/monit/monitlist'
import SrpMonitadd from '@/components/monit/monitadd'
import SrpMonitedit from '@/components/monit/monitedit'

import UserList from '@/components/user/list'
import UserPermission from '@/components/user/permission'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'



// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
  // mode: 'history',
  routes: [{
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: '监控报告',
      component: Home,
      menuShow: true,
      role: "1,2",
      redirect: '/monitreport/total',
      iconCls: 'iconfont icon-message-fill', // 图标样式class
      children: [{
          path: '/monitreport/total',
          component: MonitreportTotal,
          name: '> 监控报告总览',
          role: "1,2",
          menuShow: true
        },
        {
          path: '/monitreport/detailed',
          component: MonitreportDetailed,
          name: '> 详细监控信息',
          role: "",
          menuShow: true
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: 'SRP管理',
      menuShow: true,
      role: "1,2",
      iconCls: 'iconfont icon-sever-fill', // 图标样式class
      children: [{
          path: '/srp/list',
          component: SrpList,
          name: '> SRP列表',
          role: "1,2",
          menuShow: true

        },
        {
          path: '/srp/listadd',
          component: SrpListadd,
          name: '> SRP新增',
          role: "",
          menuShow: false
        },
        {
          path: '/srp/listedit',
          component: SrpListedit,
          name: '> SRP修改',
          role: "",
          menuShow: false
        },
        {
          path: '/monit/monitlist',
          component: SrpMonitlist,
          name: '> SRP监控项列表',
          role: "",
          menuShow: false
        },
        {
          path: '/monit/monitadd',
          component: SrpMonitadd,
          name: '> SRP监控项增加',
          role: "",
          menuShow: false
        },
        {
          path: '/monit/monitedit',
          component: SrpMonitedit,
          name: '> SRP监控项增加',
          role: "",
          menuShow: false
        },
      ]
    },

    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      role: "1,2",
      iconCls: 'iconfont icon-contacts-fill', // 图标样式class
      children: [{
          path: '/user/list',
          component: UserList,
          name: '> 帐户管理',
          role: "1",
          menuShow: true
        },
        {
          path: '/user/permission',
          component: UserPermission,
          name: '> 用户权限',
          role: "1,2",
          menuShow: true
        }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      role: "1,2",
      iconCls: 'iconfont icon-setting-fill',
      children: [{
          path: '/user/profile',
          component: UserProfile,
          name: '> 个人信息',
          role: "1,2",
          menuShow: true
        },
        {
          path: '/user/changepwd',
          component: UserChangePwd,
          name: '> 修改密码',
          role: "1,2",
          menuShow: true
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN')
    if (AUTH_TOKEN) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN')
    if (!AUTH_TOKEN) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

export default router
