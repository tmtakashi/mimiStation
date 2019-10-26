import Vue from 'vue'
import Vuex from 'vuex'
import peaks from "peaks.js";
import firebase from "firebase/app";
import "firebase/firestore";

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: {},
        status: false,
        audio: Object,
        p: Object,
        pointATime: 0,
        pointBTime: 0,
        markedPointA: false,
        markedPointB: false,
        drawer: false,
        editMode: false,
        ABLoops: [],
        isLoading: false
    },
    getters: {
        user(state) { return state.user },
        isSignedIn(state) { return state.status },
        audio(state) { return state.audio },
        p(state) { return state.p },
        pointATime(state) { return state.pointATime },
        pointBTime(state) { return state.pointBTime },
        markedPointA(state) { return state.markedPointA },
        markedPointB(state) { return state.markedPointB },
        drawer(state) { return state.drawer },
        editMode(state) { return state.editMode },
        ABLoops(state) { return state.ABLoops },
        isLoading(state) { return state.isLoading }
    },
    mutations: {
        onAuthStateChanged(state, user) {
            state.user = user; //firebaseが返したユーザー情報
        },
        onUserStatusChanged(state, status) {
            state.status = status; //ログインしてるかどうか true or false
        },
        initializeP(state, options) {
            state.p = peaks.init(options);
            state.p.zoom.setZoom(2);
        },
        setPointATime(state, time) {
            state.pointATime = time;
        },
        setPointBTime(state, time) {
            state.pointBTime = time;
        },
        toggleMarkedPointA(state) {
            state.markedPointA = !state.markedPointA;
        },
        toggleMarkedPointB(state) {
            state.markedPointB = !state.markedPointB;
        },
        changeEditMode(state, mode) {
            state.editMode = mode;
        },
        toggleDrawer(state) {
            state.drawer = !state.drawer;
        },
        setAudio(state, audio) {
            state.audio = audio;
        },
        toggleLoading(state, bool) {
            state.isLoading = bool;
        }
    },
    actions: {
        playLoop(context, loop) {
            const p = context.state.p;
            const segment = p.segments.getSegment(loop.id);
            context.commit("setPointATime", segment.startTime);
            context.commit("setPointBTime", segment.endTime);
            p.player.seek(segment.startTime);
        },
        deleteABLoop(context, loop) {
            const p = context.state.p;
            p.segments.removeById(loop.id);
            context.state.ABLoops = p.segments.getSegments();
            context.commit("setPointATime", 0);
            context.commit("setPointBTime", 0);
        },
        addABLoop(context, labelText) {
            const segment = {
                startTime: context.state.pointATime,
                endTime: context.state.pointBTime,
                labelText: labelText,
                editable: true
            };
            const p = context.state.p;
            p.segments.add(segment);
            context.state.ABLoops = p.segments.getSegments();
            p.points.removeAll();
        },
        setSource(context, path) {
            context.commit("toggleLoading", true);
            var audioContext = new AudioContext();
            var storageRef = firebase.storage().ref();
            storageRef.child(path).getDownloadURL().then(function (url) {
                var options = {
                    mediaUrl: url,
                    webAudio: {
                        audioContext: audioContext
                    },
                };
                context.state.p.setSource(options, function (error) {
                    context.commit("toggleLoading", false)
                });
            })
        }
    }
});