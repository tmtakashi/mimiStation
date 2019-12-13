import peaks from "peaks.js";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
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
    playLoop({ state, commit }, loop) {
        const p = state.p;
        const segment = p.segments.getSegment(loop.id);
        commit("setPointATime", segment.startTime);
        commit("setPointBTime", segment.endTime);
        p.player.seek(segment.startTime);
    },
    deleteABLoop({ state, commit }, { loop, songList }) {
        const p = state.p;
        p.segments.removeById(loop.id);
        state.ABLoops = p.segments.getSegments();
        let db = firebase.firestore();
        let userUid = state.user.uid;
        let songIdx = songList.findIndex(song => song.path === state.currentSong.path);
        songList[songIdx].ABLoops = state.ABLoops;
        db.collection("users")
            .doc(userUid)
            .update({
                songs: songList
            }).then(() => {
                commit("setPointATime", 0);
                commit("setPointBTime", 0);
            })

    },
    addABLoop({ state }, { labelText, songList }) {
        return new Promise((resolve, reject) => {
            const segment = {
                startTime: state.pointATime,
                endTime: state.pointBTime,
                labelText: labelText,
                editable: true,
                id: state.ABLoops.length + 1
            };
            const p = state.p;
            p.segments.add(segment);
            const segments = p.segments.getSegments()
            // convert segment object into firebase handlable object
            state.ABLoops = segments.map(segment => {
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
            let userUid = state.user.uid;
            let songIdx = songList.findIndex(song => song.path === state.currentSong.path);
            songList[songIdx].ABLoops = state.ABLoops;
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
    setSource({ state, commit }, song) {
        commit("toggleLoading", true);
        var audioContext = state.audioContext;
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
                    state.p.setSource(options, function (error) {
                        commit("toggleLoading", false)
                        if (!state.songSelected) {
                            commit("toggleSongSelected", true);
                        }
                        // Set ABLoops
                        state.p.segments.add(segments);
                        state.ABLoops = segments;
                    });
                    if (state.audioContext.state != 'running') {
                        state.audioContext.resume();
                    }
                };
            };
            request.send();
        });
    },
    changePlaybackRate({ state }, rate) {
        state.p.player._mediaElement.playbackRate = rate;
    },
}