import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/globe.css'
import {form,formitem,input,Button,header,aside,main} from 'element-ui'
// 导入字体图标
import './assets/fonts/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table',TreeTable)

// 引入ElementUI全局样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 导入弹框提示组件
import {Message} from 'element-ui'
Vue.prototype.$message = Message;

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

// 设置拦截请求
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
  console.log(config);
  
})
// 把axios挂在到Vue的原型对象上
Vue.prototype.$http = axios;

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
