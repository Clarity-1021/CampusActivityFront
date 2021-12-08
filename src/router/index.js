import Vue from 'vue'
import Router from 'vue-router'

import Login from "../components/Login";
import Register from "../components/Register";
import NewActivity from "../components/User/NewActivity";
import Home from "../components/Main/Home";
import MyActivityCreated from "../components/My/MyActivityCreated";
import MyActivityAttend from "../components/My/MyActivityAttend";
import ActivityList from "../components/User/ActivityList";
import HotActivity from "../components/User/HotActivity";
import Message from "../components/User/Message";
import AdminActivityChecked from "../components/Admin/AdminActivityChecked";
import AdminActivityUnChecked from "../components/Admin/AdminActivityUnChecked";
import ActivityDetail from "../components/User/ActivityDetail";
import HelloPage from "../components/Main/HelloPage";
import store from '../store'

Vue.use(Router);

export const router = new Router({
  mode : 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/HelloPage',
      name: 'HelloPage',
      component: HelloPage,
    },
    {
      path: '/NewActivity',
      name: 'NewActivity',
      component: NewActivity,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/MyActivityCreated',
      name: 'MyActivityCreated',
      component: MyActivityCreated,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/ActivityList',
      name: 'ActivityList',
      component: ActivityList,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/Message',
      name: 'Message',
      component: Message,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/HotActivity',
      name: 'HotActivity',
      component: HotActivity,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/AdminActivityChecked',
      name: 'AdminActivityChecked',
      component: AdminActivityChecked,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/AdminActivityUnChecked',
      name: 'AdminActivityUnChecked',
      component: AdminActivityUnChecked,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/MyActivityAttend',
      name: 'MyActivityAttend',
      component: MyActivityAttend,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
    {
      path: '/ActivityDetail',
      name: 'ActivityDetail',
      component: ActivityDetail,
      meta: {
        requireAuth: true // 需要登录权限
      }
    },
  ]
})

//前端登录拦截
// router.beforeEach(function (to, from ,next) {
//   if (to.matched.some(record => record.meta.requireAuth)) {
//       if (store.state.token) {
//         if (store.state.role==="admin") {
//           if (to.path==="/Login"||to.path==="/Register"||to.path==="/AdminActivityChecked"||to.path==="/AdminActivityUnChecked"||to.path==="/ConferenceDetail") {
//             next();
//           }else {
//             next({
//               path: '/AdminActivityUnChecked'
//             })
//           }
//         }else {
//           if (to.path!=="/AdminActivityChecked"&&to.path!=="/AdminActivityUnChecked") {
//             next();
//           }else {
//             next({
//               path: '/'
//             })
//           }
//         }
//       } else {
//         next({
//           path: '/HelloPage',
//           query: {redirect: to.fullPath} // 登录成功之后重新跳转到该路由
//         })
//       }
//     } else {
//       next()
//     }
// })
