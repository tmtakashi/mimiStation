import firebase from "@firebase/app";
import "@firebase/auth";
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
    signup(email, password) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                console.log("Create account: ", res.user.email);
                router.push('/')
            })
            .catch(error => {
                console.log(error.message);
            });
    },
    login(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            localStorage.setItem('jwt', res.user.qa)
            router.push('/')
        })
    },
    loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (res) {
            localStorage.setItem('jwt', res.user.qa)
            router.push('/')
        }).catch(function (error) {
            alert("Failed to login with Google")
        })
    },
    logout() {
        localStorage.removeItem('jwt')
        firebase.auth().signOut()
    }
};