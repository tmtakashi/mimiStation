import Vue from 'vue'
import Router from 'vue-router'
import Player from './views/Player.vue'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'player',
            component: Player
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        }
    ]
})
