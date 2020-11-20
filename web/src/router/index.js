import Vue from 'vue'
import VueRouter from 'vue-router'
import FolderFeed from '../views/FolderFeed.vue'

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
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
