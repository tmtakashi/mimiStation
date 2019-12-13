import Vue from 'vue'
import Vuex from 'vuex'
import peaks from "peaks.js";
import firebase from "firebase/app";
import "firebase/firestore";

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});