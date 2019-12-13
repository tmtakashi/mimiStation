export default {
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
}