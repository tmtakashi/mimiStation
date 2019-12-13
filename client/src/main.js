import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Firebase from "./firebase";
import store from './store/index'

Firebase.init();

Vue.config.productionTip = false
Vue.use(Vuex)

let app = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
