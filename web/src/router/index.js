import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import FolderFeed from '../views/FolderFeed.vue'
import Feed from '../views/Feed.vue'
import NewArticles from '../views/NewArticles.vue'
import Favorites from '../views/Favorites.vue'
import History from '../views/History.vue'
import Test from '../views/Test.vue'
import NotFound from '../views/404.vue'
import ServerError from '../views/500.vue'
import Login from '../views/Login.vue'
import Preferences from '../views/Preferences.vue'
import SignUp from '../views/SignUp.vue'
import PasswordReset from '../views/PasswordReset.vue'

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
    path: '/404',
    name: '404',
    component: NotFound,
    beforeEnter: Guard
  },
  {
    path: '/500',
    name: '500',
    component: ServerError,
    beforeEnter: Guard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/passwordreset',
    name: 'PasswordReset',
    component: PasswordReset
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/folder/:folder',
    name: 'FolderFeed',
    component: FolderFeed,
    beforeEnter: Guard
  },
  {
    path: '/preferences',
    name: 'Preferences',
    component: Preferences,
    beforeEnter: Guard
  },
  {
    path: '/feed/:feedId/:feedName/page/:page',
    name: 'Feed',
    component: Feed,
    beforeEnter: Guard,
    meta: { title: `Feed - ${process.env.VUE_APP_NAME}` }
  },
  {
    path: '/new/page/:page',
    name: 'NewArticles',
    component: NewArticles,
    beforeEnter: Guard,
    meta: { title: `New articles - ${process.env.VUE_APP_NAME}` }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    beforeEnter: Guard,
    meta: { title: `Favorites - ${process.env.VUE_APP_NAME}` }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    beforeEnter: Guard,
    meta: { title: `History - ${process.env.VUE_APP_NAME}` }
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    beforeEnter: Guard,
    meta: { title: `Test - ${process.env.VUE_APP_NAME}` }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
    beforeEnter: Guard,
    meta: { title: `Page not found - ${process.env.VUE_APP_NAME}` }
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 };
  }
})

export default router
