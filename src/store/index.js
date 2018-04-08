import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import state from './state'

Vue.use(Vuex) // enable use of Vuex store

export default new Vuex.Store({
  state,
  getters,
  mutations
})
