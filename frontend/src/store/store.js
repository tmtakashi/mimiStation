import Vue from 'vue'
import Vuex from 'vuex'
import peaks from "peaks.js";

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        p: Object,
        pointATime: 0,
        pointBTime: 0,
        ABLoops: []
    },
    getters: {
        p(state) { return state.p },
        pointATime(state) { return state.pointATime },
        pointBTime(state) { return state.pointBTime },
        ABLoops(state) { return state.ABLoops }
    },
    mutations: {
        initializeP(state, options) {
            state.p = peaks.init(options);
            state.p.zoom.setZoom(2);
        },
        setPointATime(state, time) {
            state.pointATime = time;
        },
        setPointBTime(state, time) {
            state.pointBTime = time;
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
            context.commit("setPointATime", 0);
            context.commit("setPointBTime", 0);
        },
    }
});