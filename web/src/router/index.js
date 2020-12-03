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

const isAuthenticated = () => {
  return new Promise((resolve,reject) => {
    axios.get(`${process.env.VUE_APP_API}/user/current`,{withCredentials: true})
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      })
  })
};

const Auth = async (to,from,next) => {
  try{
    const authenticated = await isAuthenticated();

    if(to.name === 'Login' && authenticated)
      next({name : '/'})
    if(to.name !== 'Login' && authenticated)
      next();
    else if(to.name === 'Login')
      next();
    else
      next();
  }
  catch{
    if(to.name === 'Login')
      next();
    else
      next({name: 'Login'});
  }
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/folder/:folder',
    name: 'FolderFeed',
    component: FolderFeed
  },
  {
    path: '/folder/:folder',
    name: 'FolderView',
    component: FolderFeed
  },
  {
    path: '/feed/:feedId/:feedName/page/:page',
    name: 'Feed',
    component: Feed
  },
  {
    path: '/new/page/:page',
    name: 'NewArticles',
    component: NewArticles,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 };
  }
})

router.beforeEach((to,from,next) => {
  Auth(to,from,next);
})

export default router
