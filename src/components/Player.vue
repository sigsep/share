<template>
  <div>
        <v-card>
          <v-toolbar :color="conf.titleColor">
            <v-toolbar-title class="white--text">
              {{title}}
            </v-toolbar-title>
            <v-btn
              :dark="conf.dark"
              style="margin-right: 0em"
              color="green accent-2"
              bottom
              right
              absolute
              fab
              v-on:click='playpause'
              :loading='isLoading'
            >
              <v-icon v-if="!isPlaying">mdi-play</v-icon>
              <v-icon v-else>mdi-pause</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text
            class="text-center"
            style="padding-left: 0px; padding-right: 0px; "
          >
            <div id="playlist" ref="playlist" :style="cssProps"></div>
            <div style="margin-bottom: -10px; margin-top: 5px" v-if="NumberOfTracks > 0">
              <b>Keyboard Shortcuts</b>:
                Play/Pause: <kbd>Space</kbd> –
                Solo/Unsolo Sources: <kbd v-for="n in NumberOfTracks" :key="n.id">{{ n }}</kbd> –
                Mute/Unmute Sources: <kbd>Ctrl</kbd> + <kbd v-for="n in NumberOfTracks" :key="n.id">{{ n }}</kbd>
            </div>
          </v-card-text>
          </v-card>
      </div>
</template>

<script>
import Mousetrap from 'mousetrap'
import _ from 'lodash'
import player from './player.js'
import './dark.css';

export default {
  name: "player",
  components: {},
  props: {
    urls: Array,
    conf: Object,
  },
  data: function () {
    return {
      trackColors: [],
      isPlaying: false,
      isLoading: false,
      player: Object,
      loaderColor: 'orange',
      loaderHeight: '26px',
      playbackPosition: 0,
      lastplaybackPosition: 0
    }
  },
  mounted: function () {
    Mousetrap.bind('space', this.playpause)
    this.initOrUpdate()
  },
  beforeDestroy: function () {
    Mousetrap.unbind('space');
    for (var i = 0; i < this.player.playlist.tracks.length; ++i) {
      (function (i) {
      Mousetrap.unbind(String(i + 1));
      })(i);
    }
    this.stop();
    delete this.player;
  },
  methods: {
    initOrUpdate: function () {
      this.player = new player(this.$refs.playlist, this.conf.zoom, this.conf.exclSolo)
      const playlist = this.$refs.playlist
      playlist.style.setProperty("width", 100)
      this.player.playlist.getEventEmitter().on('audiosourcesloaded', this.audioLoaded)
      if(this.isLoading != true) {
        this.saveState()
        this.stop()
        this.isLoading = true
        this.player.loadTargets(this.urls)
        for (var i = 0; i < this.urls.length; ++i) {
          (function (i, e) {
                e.trackColors.push(e.urls[i].color)
                Mousetrap.bind(String(i + 1), function () {
                  e.player.playlist.getEventEmitter().emit('solo', e.player.playlist.tracks[i])
                });
                Mousetrap.bind(['ctrl+' + String(i + 1), 'meta+' + String(i + 1)], function () {
                  e.player.playlist.getEventEmitter().emit('mute', e.player.playlist.tracks[i])
                });
            })(i, this)
          }
        }
    },
    saveState: function () {
      this.lastplaybackPosition = this.playbackPosition
    },
    playpause: function (event) {
      if (this.isPlaying) {
        this.player.playlist.getEventEmitter().emit('pause')

      }
      else {
        this.player.playlist.getEventEmitter().emit('play')
        this.player.playlist.getEventEmitter().on('finished', this.stop);
      }
      this.isPlaying = ! this.isPlaying
      event.stopPropagation();
      return false;
    },
    stop: function () {
      this.player.playlist.getEventEmitter().emit('stop')
      this.isPlaying = false
    },
    audioLoaded: function () {
      this.isLoading = false
    },
    updateTime: function (playbackPosition) {
      this.playbackPosition = playbackPosition
    },
    debounceInitOrUpdate:_.debounce(function(){
      this.initOrUpdate()
    }, 600),
  },
  computed: {
    title: function () {
      if (typeof this.conf === "undefined") {
        return "Empty Track"
      } else {
        return this.conf.title
      }
    },
    NumberOfTracks: function () {
      if (typeof this.player.playlist === "undefined") {
        return 0
      }
      else {
        return this.player.playlist.tracks.length
      }
    },
    cssProps() {
      var props = {}
      for (var i = 0; i < this.urls.length; ++i) {
        console.log(i)
        props['--track' + i.toString()] = this.trackColors[i]
      }
      return props
    }
  },
  watch: {
    urls: {
      handler: 'debounceInitOrUpdate',
    },
  }
}
</script>


<style>

.playlist-tracks .track0 header {
  background-color:var(--track0);
  color: white;
}

.playlist-tracks .track1 header {
  background-color:var(--track1);
  color: white;
}

.playlist-tracks .track2 header {
  background-color:var(--track2);
  color: white;
}

.playlist-tracks .track3 header {
  background-color:var(--track3);
  color: white;
}

.playlist-tracks .track4 header {
  background-color:var(--track4);
  color: white;
}

.playlist-tracks .track5 header {
  background-color:var(--track5);
  color: white;
}

.playlist-tracks .track6 header {
  background-color:var(--track6);
  color: white;
}

.playlist-tracks .track7 header {
  background-color:var(--track7);
  color: white;
}

.playlist-tracks .track8 header {
  background-color:var(--track8);
  color: white;
}

.playlist-tracks .track9 header {
  background-color:var(--track9);
  color: white;
}

</style>