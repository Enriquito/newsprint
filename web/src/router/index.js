import Vue from 'vue'
import VueRouter from 'vue-router'
import FolderFeed from '../views/FolderFeed.vue'
import Feed from '../views/Feed.vue'

Vue.use(VueRouter)

const routes = [
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
    path: '/feed/:feedId/:feedName',
    name: 'Feed',
    component: Feed
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
