import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login";
import Home from "../components/home";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
  },
];
const router = new VueRouter({
  routes,
});
router.beforeEach((to,from,next)=> {
  // to要访问的路径
  // from代表冲哪个路径跳转而来
  // next()一个函数，表示放行
  if(to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})


export default router;
