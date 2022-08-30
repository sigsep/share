import * as WaveformPlaylist from 'waveform-playlist'

var Player = function (ref, zoom = 1280, exclSolo = false) {
    this.playlist = WaveformPlaylist.init({
        samplesPerPixel: zoom,
        waveHeight: 27,
        container: ref,
        timescale: false,
        mono: true,
        exclSolo: exclSolo,
        isAutomaticScroll: true,
        state: 'cursor',
        colors: {
            waveOutlineColor: "#313131",
            fadeColor: "black",
        },
        barWidth: 1.5,
        barGap: 1,
        controls: {
            show: true, //whether or not to include the track controls
            width: 120, //width of controls in pixels
            widgets: {
                remove: true,
                collapse: true
            },
        },
        zoomLevels: [zoom]
    });
}

Player.prototype.loadTargets = function (tracks) {
    this.playlist.getEventEmitter().emit('stop')
    this.playlist.clear();
    this.playlist.tracks = []
    var tracksToLoad = []
    for (let track of tracks) {
        tracksToLoad.push(
            {
                "src": track.src,
                "name": track.name,
                "muted": track.mute,
                "customClass": track.customClass,
                "soloed": track.solo,
            }
        );
    }
    this.playlist.load(tracksToLoad);
}

Player.prototype.addTrack = function(track) {
  this.playlist.load([
    {
        "src": track.src,
        "name": track.name,
        "muted": track.mute,
        "customClass": track.customClass,
        "soloed": track.solo,
    }
  ])
}

export default Player
