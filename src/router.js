import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
// 导入右侧显示的组件
import users from './components/user/users.vue'
import Rights from './components/Power/Rights.vue'
import Roles from './components/Power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Goods from './components/goods/Goods.vue'
import Params from './components/goods/Params.vue'

// 订单管理
import Orders from './components/Orders/Orders.vue'

// 数据报表
import Reports from './components/Reports/Reports.vue'
 
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', redirect: '/welcome', component: Home, children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports },
      ]
    },

  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从那个路径跳转而来
  // next是一个函数  表示放行
  // next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


// 解决在使用ElementUi时点击同一个路由，页面报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



export default router