<template>
  <div>
        <v-card dark>
          <v-toolbar :color="conf.titleColor">
            <v-btn
              color="green accent-3"
              style="margin-left:2px;"
              icon
              outlined
              large
              v-on:click='playpause'
              :loading='isLoading'
            >
              <v-icon v-if="!isPlaying">mdi-play</v-icon>
              <v-icon v-else>mdi-pause</v-icon>
            </v-btn>
            <v-toolbar-title class="white--text">
              {{title}}
            </v-toolbar-title>

              <v-spacer></v-spacer>
              <v-dialog
                dark
                v-model="dialog"
                scrollable
                max-width="640px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="white"
                    dark
                    icon
                    top
                    left
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-information</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>About share.unmix.app</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px;">
                    <div style="margin-bottom: -10px; margin-top: 5px">
                      <b>Keyboard Shortcuts</b>:
                        Play/Pause: <kbd>Space</kbd> –
                        Solo/Unsolo Sources: <kbd v-for="n in NumberOfTracks" :key="n.id">{{ n }}</kbd> –
                        Mute/Unmute Sources: <kbd>Ctrl</kbd> + <kbd v-for="n in NumberOfTracks" :key="n.id">{{ n }}</kbd>
                    </div>

                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="dialog = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </v-toolbar>
          <v-card-text
            class="text-center"
            style="padding-left: 0px; padding-right: 0px; "
          >
            <div id="playlist" ref="playlist" :style="cssProps"></div>
            <p style="margin-bottom:-10px; padding: 0" class="createdwith">Created with <a href="https://share.unmix.app">share.unmix.app</a></p>
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
      lastplaybackPosition: 0,
      dialog: false
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

.createdwith {
  margin-top: 0px; 
  margin-bottom: -10px; 
  padding: 0px; 
  color: white; 
  font-size: 0.9em;
}

.createdwith a {
  color: #d3b719;
  text-decoration: none;
}

.playlist-tracks .track0 .track-header {
  background-color:var(--track0);
  color: white;
}

.playlist-tracks .track1 .track-header {
  background-color:var(--track1);
  color: white;
}

.playlist-tracks .track2 .track-header {
  background-color:var(--track2);
  color: white;
}

.playlist-tracks .track3 .track-header {
  background-color:var(--track3);
  color: white;
}

.playlist-tracks .track4 .track-header {
  background-color:var(--track4);
  color: white;
}

.playlist-tracks .track5 .track-header {
  background-color:var(--track5);
  color: white;
}

.playlist-tracks .track6 .track-header {
  background-color:var(--track6);
  color: white;
}

.playlist-tracks .track7 .track-header {
  background-color:var(--track7);
  color: white;
}

.playlist-tracks .track8 .track-header {
  background-color:var(--track8);
  color: white;
}

.playlist-tracks .track9 .track-header {
  background-color:var(--track9);
  color: white;
}

</style>