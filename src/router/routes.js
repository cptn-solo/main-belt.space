import Home from '../views/Home'
import NotFoundComponent from "../views/404.vue";

export default [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/About.vue")
  },
  {
    path: "/woffler",
    name: "woffler",
    component: () => import("../views/woffler/Woffler.vue")
  },
  { path: "*", component: NotFoundComponent }
]