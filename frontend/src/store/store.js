import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        pointATime: null,
        pointBTime: null,
        ABLoops: [
            {
                name: 'hoge',
                pointATime: 0,
                pointBTime: 5
            }
        ]
    },
    getters: {
        pointATime(state) { return state.pointATime },
        pointBTime(state) { return state.pointBTime },
        ABLoops(state) { return state.ABLoops }
    },
    mutations: {
        addABLoop(state, name) {
            state.ABLoops.push(
                {
                    name: name,
                    pointATime: state.pointATime,
                    pointBTime: state.pointBTime
                }
            )
        },
        deleteABLoop(state, index) {
            state.ABLoops.splice(index, 1);
        },
        setPointATime(state, time) {
            state.pointATime = time;
        },
        setPointBTime(state, time) {
            state.pointBTime = time;
        }
    }
});