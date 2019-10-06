import Vue from 'vue'
import Router from 'vue-router'
import firebase from "firebase/app"
import "firebase/auth"
import Player from './views/Player.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import store from './store/store'

Vue.use(Router)

var router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'player',
            component: Player,
            beforeEnter: requireAuth
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup,
        }
    ]
})

export default router

function requireAuth(to, from, next) {
    firebase.auth().onAuthStateChanged(function (user) {
        user = user ? user : {};
        store.commit('onAuthStateChanged', user);
        store.commit('onUserStatusChanged', user.uid ? true : false);
        if (!store.getters.isSignedIn) {
            next({
                path: "/login"
            });
        } else {
            next()
        }
    })
}
