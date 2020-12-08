import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import FolderFeed from '../views/FolderFeed.vue'
import Feed from '../views/Feed.vue'
import NewArticles from '../views/NewArticles.vue'
import Favorites from '../views/Favorites.vue'
import History from '../views/History.vue'
import Test from '../views/Test.vue'
import Login from '../views/Login.vue'
import Settings from '../views/Settings.vue'

const isAuthenticated = () => {
  return new Promise((resolve,reject) => {
    axios.get(`${process.env.VUE_APP_API}/user/current`,{withCredentials: true})
      .then(result => {
        if(result.data !== null)
          resolve(true);
        else
          resolve(false);
      })
      .catch(() => {
        reject(false);
      })
  })
};

const Guard = async (to,from,next) => {
  const loggedIn = await isAuthenticated();

  if(loggedIn)
    next();
  else
    next({name: 'Login'});
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    component: Favorites,
    beforeEnter: Guard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/folder/:folder',
    name: 'FolderFeed',
    component: FolderFeed,
    beforeEnter: Guard
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    beforeEnter: Guard
  },
  {
    path: '/folder/:folder',
    name: 'FolderView',
    component: FolderFeed,
    beforeEnter: Guard
  },
  {
    path: '/feed/:feedId/:feedName/page/:page',
    name: 'Feed',
    component: Feed,
    beforeEnter: Guard
  },
  {
    path: '/new/page/:page',
    name: 'NewArticles',
    component: NewArticles,
    beforeEnter: Guard
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    beforeEnter: Guard
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    beforeEnter: Guard
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    beforeEnter: Guard
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 };
  }
})

// router.beforeEach((to,from,next) => {
//   Auth(to,from,next);
// })

export default router
