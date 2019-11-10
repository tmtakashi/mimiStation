import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import router from './router'

const config = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_BUCKET_ID,
    messagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID
}

export default {
    init() {
        firebase.initializeApp(config);
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    },
    async signup(email, password) {
        let result;
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                result = res;
            })
            .catch(error => {
                alert(error.message);
            });
        return result
    },
    async login(email, password) {
        let result;
        await firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            res.user.getIdToken().then(idToken => {
                localStorage.setItem('jwt', idToken.toString())
            })
            result = res;
        }).catch(function (err) {
            alert(err.message);
        })
        return result;
    },
    async loginWithGoogle() {
        let result;
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider).then(function (res) {
            res.user.getIdToken().then(idToken => {
                localStorage.setItem('jwt', idToken.toString())
            })
            result = res;
        }).catch(function (error) {
            alert("Failed to login with Google")
        });
        return result;
    },
    logout() {
        localStorage.removeItem('jwt')
        firebase.auth().signOut()
    },
    db() {
        return firebase.firestore()
    }
};