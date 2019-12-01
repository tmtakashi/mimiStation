import Vue from 'vue'
import Vuex from 'vuex'
import peaks from "peaks.js";
import firebase from "firebase/app";
import "firebase/firestore";
import Dexie from "dexie";

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: {},
        status: false,
        audioContext: new (window.AudioContext || window.webkitAudioContext),
        sourceNode: Object,
        gainNode: Object,
        leftGainNode: Object,
        rightGainNode: Object,
        channelSplitterNode: Object,
        mergerNode: Object,
        stereoPannerNode: Object,
        peakings: [],
        audioElement: Object,
        currentSong: Object,
        p: Object,
        pointATime: 0,
        pointBTime: 0,
        markedPointA: false,
        markedPointB: false,
        drawer: false,
        editMode: false,
        ABLoops: [],
        isLoading: false,
        showSongList: false,
        songSelected: false
    },
    getters: {
        user(state) { return state.user },
        isSignedIn(state) { return state.status },
        audioElement(state) { return state.audioElement },
        audioContext(state) { return state.audioContext },
        currentSong(state) { return state.currentSong },
        p(state) { return state.p },
        pointATime(state) { return state.pointATime },
        pointBTime(state) { return state.pointBTime },
        markedPointA(state) { return state.markedPointA },
        markedPointB(state) { return state.markedPointB },
        drawer(state) { return state.drawer },
        editMode(state) { return state.editMode },
        ABLoops(state) { return state.ABLoops },
        isLoading(state) { return state.isLoading },
        showSongList(state) { return state.showSongList },
        songSelected(state) { return state.songSelected },
        sourceNode(state) { return state.sourceNode },
    },
    mutations: {
        onAuthStateChanged(state, user) {
            state.user = user; //firebaseが返したユーザー情報
        },
        onUserStatusChanged(state, status) {
            state.status = status; //ログインしてるかどうか true or false
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
        setAudioElement(state, audioElement) {
            state.audioElement = audioElement;
        },
        toggleLoading(state, bool) {
            state.isLoading = bool;
        },
        toggleSongList(state, bool) {
            state.showSongList = bool;
        },
        toggleSongSelected(state, bool) {
            state.songSelected = bool;
        },
        setCurrentSong(state, song) {
            state.currentSong = song;
        },
        setAudioContext(state, audioContext) {
            state.audioContext = audioContext;
        },
        setSourceNode(state, sourceNode) {
            state.sourceNode = sourceNode;
        },
        setGainNode(state, { gainNode, type }) {
            switch (type) {
                case 'center':
                    state.gainNode = gainNode;
                    break;
                case 'right':
                    state.rightGainNode = gainNode;
                    break;
                case 'left':
                    state.leftGainNode = gainNode;
                    break;
            }
        },
        setGainValue(state, { val, type }) {
            switch (type) {
                case 'center':
                    state.gainNode.gain.value = val;
                    break;
                case 'right':
                    state.rightGainNode.gain.value = val;
                    break;
                case 'left':
                    state.leftGainNode.gain.value = val;
                    break;
            }
        },
        setSplitterNode(state, splitterNode) {
            state.channelSplitterNode = splitterNode;
        },
        setMergerNode(state, mergerNode) {
            state.mergerNode = mergerNode;
        },
        setStereoPannerNode(state, stereoPannerNode) {
            state.stereoPannerNode = stereoPannerNode;
        },
        setPanValue(state, val) {
            state.stereoPannerNode.pan.value = val;
        },
        setPeakings(state, peakings) {
            state.peakings = peakings;
        },
        setPeakingGain(state, { index, gain }) {
            state.peakings[index].gain.value = gain;
        },
        resetPeakingGain(state) {
            state.peakings.forEach(function (peaking) {
                peaking.gain.value = 0;
            });
        },
        setP(state, p) {
            state.p = p;
        }
    },
    actions: {
        initializeP({ state, commit }, options) {
            commit("setP", peaks.init(options));
            var p = state.p;
            var audioContext = state.audioContext;
            var source = audioContext.createMediaElementSource(p.player._mediaElement)
            var gainNode = audioContext.createGain();
            var leftGainNode = audioContext.createGain();
            var rightGainNode = audioContext.createGain();
            var splitterNode = audioContext.createChannelSplitter(2);
            var mergerNode = audioContext.createChannelMerger(2);
            var stereoPannerNode = audioContext.createStereoPanner();

            var NUM_BANDS = 10;
            var peakings = new Array(NUM_BANDS);
            // Center frequency
            var frequency = 31.25;
            for (var i = 0; i < NUM_BANDS; i++) {
                // Create the instance of BiquadFilterNode
                var peaking = audioContext.createBiquadFilter();
                // Calculate center frequency
                if (i !== 0) {
                    frequency *= 2;
                }
                // Set parameters
                peaking.type = (typeof peaking.type === 'string') ? 'peaking' : 5;
                peaking.frequency.value = frequency;
                peaking.Q.value = 2;
                peaking.gain.value = 0;  // The default value
                peakings[i] = peaking;
            }

            source.connect(gainNode);
            gainNode.connect(peakings[0]);
            peakings.forEach(function (peaking, index) {
                if (index < (NUM_BANDS - 1)) {
                    peaking.connect(peakings[index + 1]);
                } else {
                    peaking.connect(splitterNode);
                }
            });
            splitterNode.connect(leftGainNode, 0);
            splitterNode.connect(rightGainNode, 1);
            leftGainNode.connect(mergerNode, 0, 0);
            rightGainNode.connect(mergerNode, 0, 1);
            mergerNode.connect(stereoPannerNode);
            stereoPannerNode.connect(audioContext.destination);

            commit("setSourceNode", source);
            commit("setGainNode", { gainNode: gainNode, type: 'center' });
            commit("setGainNode", { gainNode: leftGainNode, type: 'left' });
            commit("setGainNode", { gainNode: rightGainNode, type: 'right' });
            commit("setSplitterNode", splitterNode);
            commit("setMergerNode", mergerNode);
            commit("setStereoPannerNode", stereoPannerNode);
            commit("setPeakings", peakings);
        },
        playLoop(context, loop) {
            const p = context.state.p;
            const segment = p.segments.getSegment(loop.id);
            context.commit("setPointATime", segment.startTime);
            context.commit("setPointBTime", segment.endTime);
            p.player.seek(segment.startTime);
        },
        deleteABLoop(context, { loop, songList }) {
            const p = context.state.p;
            p.segments.removeById(loop.id);
            context.state.ABLoops = p.segments.getSegments();
            let db = firebase.firestore();
            let userUid = context.state.user.uid;
            let songIdx = songList.findIndex(song => song.path === context.state.currentSong.path);
            songList[songIdx].ABLoops = context.state.ABLoops;
            db.collection("users")
                .doc(userUid)
                .update({
                    songs: songList
                }).then(() => {
                    context.commit("setPointATime", 0);
                    context.commit("setPointBTime", 0);
                })

        },
        addABLoop(context, { labelText, songList }) {
            return new Promise((resolve, reject) => {
                const segment = {
                    startTime: context.state.pointATime,
                    endTime: context.state.pointBTime,
                    labelText: labelText,
                    editable: true,
                    id: context.state.ABLoops.length + 1
                };
                const p = context.state.p;
                p.segments.add(segment);
                const segments = p.segments.getSegments()
                // convert segment object into firebase handlable object
                context.state.ABLoops = segments.map(segment => {
                    return {
                        color: segment.color,
                        editable: segment.editable,
                        endTime: segment.endTime,
                        id: segment.id,
                        labelText: segment.labelText,
                        startTime: segment.startTime
                    }
                });
                let db = firebase.firestore();
                let userUid = context.state.user.uid;
                let songIdx = songList.findIndex(song => song.path === context.state.currentSong.path);
                songList[songIdx].ABLoops = context.state.ABLoops;
                db.collection("users")
                    .doc(userUid)
                    .update({
                        songs: songList
                    }).then(() => {
                        p.points.removeAll();
                    })
                resolve();
            })
        },
        setSource(context, song) {
            context.commit("toggleLoading", true);
            var audioContext = context.state.audioContext;
            var storageRef = firebase.storage().ref();
            var path = song.path;
            var segments = song.ABLoops;
            storageRef.child(path).getDownloadURL().then(function (url) {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'blob';
                request.onload = function () {
                    var reader = new FileReader();
                    reader.readAsDataURL(request.response);
                    reader.onload = function (e) {
                        var dataURL = e.target.result;
                        var options = {
                            mediaUrl: dataURL,
                            webAudio: {
                                audioContext: audioContext
                            }
                        };
                        context.state.p.setSource(options, function (error) {
                            context.commit("toggleLoading", false)
                            if (!context.state.songSelected) {
                                context.commit("toggleSongSelected", true);
                            }
                            // Set ABLoops
                            context.state.p.segments.add(segments);
                            context.state.ABLoops = segments;
                        });
                        if (context.state.audioContext.state != 'running') {
                            context.state.audioContext.resume();
                        }
                    };
                };
                request.send();
            });
        },
        changePlaybackRate(context, rate) {
            context.state.p.player._mediaElement.playbackRate = rate;
        },
    }
});