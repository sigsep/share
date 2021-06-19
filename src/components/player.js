import * as WaveformPlaylist from 'waveform-playlist'

var Player = function (ref, zoom = 1280, exclSolo = false) {
    this.playlist = WaveformPlaylist.init({
        samplesPerPixel: zoom,
        waveHeight: 60,
        container: ref,
        timescale: true,
        mono: true,
        exclSolo: exclSolo,
        isAutomaticScroll: true,
        state: 'cursor',
        colors: {
            waveOutlineColor: "black"
        },
        controls: {
            show: true, //whether or not to include the track controls
            width: 140, //width of controls in pixels
            widgets: {
                remove: false,
                collapse: false
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
