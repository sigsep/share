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
            style="padding-left: 0px; padding-right: 0px"
          >
            <div id="playlist" ref="playlist"></div>
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
      bgColor: {
        type: String,
        default: "red"
      },
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
    this.initPlayer()
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
    initPlayer: function () {
      this.player = new player(this.conf.dark, this.$refs.playlist, this.conf.zoom, this.conf.exclSolo)
      const playlist = this.$refs.playlist
      console.log(this.$refs.playlist.$el)
      playlist.style.setProperty("width", 100)
      this.player.playlist.getEventEmitter().on('audiosourcesloaded', this.audioLoaded)
      // this.player.playlist.getEventEmitter().on('timeupdate', this.updateTime)
      if(this.isLoading != true) {
        this.saveState()
        this.stop()
        this.isLoading = true
        this.player.loadTargets(this.urls)
        for (var i = 0; i < this.urls.length; ++i) {
            (function (i, e) {
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
    }
  },
  watch: {
    urls: {
      handler: 'initPlayer'
    },
  }
}
</script>


<style>

#playlist .playlist-tracks .track0 header {
  background-color:#000000;
  color: white;
}

#playlist .playlist-tracks .track1 header {
  background-color:#48bd75;
  color: white;
}

</style>