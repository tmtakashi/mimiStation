export default function connectNodes(state) {
    const NUM_BANDS = state.peakings.length;
    // Center frequency
    var frequency = 31.25;
    for (var i = 0; i < NUM_BANDS; i++) {
        // Create the instance of BiquadFilterNode
        var peaking = state.audioContext.createBiquadFilter();
        // Calculate center frequency
        if (i !== 0) {
            frequency *= 2;
        }
        // Set parameters
        peaking.type = (typeof peaking.type === 'string') ? 'peaking' : 5;
        peaking.frequency.value = frequency;
        peaking.Q.value = 2;
        peaking.gain.value = 0;  // The default value
        state.peakings[i] = peaking;
    }
    state.sourceNode.connect(state.gainNode);
    state.gainNode.connect(state.peakings[0]);
    state.peakings.forEach(function (peaking, index) {
        if (index < (NUM_BANDS - 1)) {
            peaking.connect(state.peakings[index + 1]);
        } else {
            peaking.connect(state.channelSplitterNode);
        }
    });
    state.channelSplitterNode.connect(state.leftGainNode, 0);
    state.channelSplitterNode.connect(state.rightGainNode, 1);
    state.leftGainNode.connect(state.mergerNode, 0, 0);
    state.rightGainNode.connect(state.mergerNode, 0, 1);
    state.mergerNode.connect(state.stereoPannerNode);
    state.stereoPannerNode.connect(state.audioContext.destination);
}