import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
    setFolders(state, folder){
      state.folders = folder;
    },
    setUnreadArticles(state, count){
      state.unreadArticles = count;
    }
  },
  actions: {
  },
  modules: {
  }
})
