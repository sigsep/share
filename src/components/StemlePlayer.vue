<template>
  <div>
    <v-container>
      <v-btn
        color="green accent-3"
        style="margin-left: 2px"
        icon
        x-large
        v-on:click="playpause"
        :disabled="isPlaying"
        :loading="isLoading"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <div v-if="gameover">Huuuurraaaaaay</div>
      <v-container>
        <div id="playlist" ref="playlist" :style="cssProps"></div>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-autocomplete
            v-model="guess"
            :items="tracklist"
            solo
            ></v-autocomplete>
          </v-col>
          <v-col>
          <v-btn
            color="pink"
            :disabled="gameover"
            v-on:click="submitGuess"
          >
          Submit Guess
          </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import _ from "lodash";
import player from "./player.js";
import "./dark.css";

export default {
  name: "player",
  components: {},
  props: {
    urls: Array,
    conf: Object,
    guesses: Array,
  },
  data: function () {
    return {
      trackColors: [],
      isPlaying: false,
      hasPlayed: false,
      isFinished: false,
      isLoading: false,
      original_urls: Array,
      tracklist: ["wurst", "Al James - Schoolboy Facination", "toll"],
      guess: null,
      player: Object,
      loaderColor: "orange",
      loaderHeight: "26px",
      playbackPosition: 0,
      lastplaybackPosition: 0,
      dialog: false,
    };
  },
  mounted: function () {
    Mousetrap.bind("space", this.playpause);
    this.initOrUpdate();
  },
  beforeDestroy: function () {
    Mousetrap.unbind("space");
    for (var i = 0; i < this.player.playlist.tracks.length; ++i) {
      (function (i) {
        Mousetrap.unbind(String(i + 1));
      })(i);
    }
    this.stop();
    delete this.player;
  },
  methods: {
    submitGuess: function () {
      if (!this.gameover) {
        if (this.guess) {
          if (this.guess == this.title) {
            this.guesses.push(1);
          }
          else {
            this.guesses.push(-1);
          }
        }
        else {
          this.guesses.push(0);
        }
        this.guess = "";
      }
    },
    initOrUpdate: function () {
      this.player = new player(
        this.$refs.playlist,
        this.conf.zoom,
        this.conf.exclSolo
      );
      const playlist = this.$refs.playlist;
      playlist.style.setProperty("width", 100);
      this.player.playlist
        .getEventEmitter()
        .on("audiosourcesrendered", this.audioLoaded);
      if (this.isLoading != true) {
        this.saveState();
        this.stop();
        this.isLoading = true;

        this.original_urls = JSON.parse(JSON.stringify(this.urls));
        for (var j = 0; j < this.original_urls.length; ++j) {
          this.urls[j].name = " ";
        }
        this.player.loadTargets(this.urls);
        for (var i = 0; i < this.urls.length; ++i) {
          (function (i, e) {
            e.trackColors.push(e.urls[i].color);
            Mousetrap.bind(String(i + 1), function () {
              e.player.playlist
                .getEventEmitter()
                .emit("solo", e.player.playlist.tracks[i]);
            });
            Mousetrap.bind(
              ["ctrl+" + String(i + 1), "meta+" + String(i + 1)],
              function () {
                e.player.playlist
                  .getEventEmitter()
                  .emit("mute", e.player.playlist.tracks[i]);
              }
            );
          })(i, this);
        }
      }
    },
    saveState: function () {
      this.lastplaybackPosition = this.playbackPosition;
    },
    playpause: function (event) {
      if (this.isPlaying) {
        this.player.playlist.getEventEmitter().emit("pause");
      } else {
        this.player.playlist.getEventEmitter().emit("play");
        this.player.playlist.getEventEmitter().on("finished", this.stop);
      }
      this.isPlaying = !this.isPlaying;
      event.stopPropagation();
      return false;
    },
    stop: function () {
      this.player.playlist.getEventEmitter().emit("stop");
      this.isPlaying = false;
    },
    unmute: function (track) {
      // TODO: save state so that we can resume with guesses = [0, 0, 0, 1]
      if (this.guesses.length - 1 < this.player.playlist.tracks.length) {
        var track_index = this.player.playlist.tracks.indexOf(track)
        this.player.playlist.tracks[track_index].name = this.original_urls[track_index].name;
        this.player.playlist.getEventEmitter().emit("mute", track);
      }
      if (this.guesses.length >= this.player.playlist.tracks.length) {
        this.isFinished = true;
      }
    },
    audioLoaded: function () {
      this.isLoading = false;
      this.check_mute()
    },
    check_mute: function () {
      var mute_count = 0;
      if (this.guesses.includes(1)) {
        mute_count = this.player.playlist.tracks.length;
      } else {
        mute_count = this.guesses.length;
      }
      for (var g = 0; g < mute_count; ++g) {
        var track = this.player.playlist.tracks[g];
        if (this.player.playlist.mutedTracks.indexOf(track) > -1) {
          this.unmute(track);
        }
      }
    },
    updateTime: function (playbackPosition) {
      this.playbackPosition = playbackPosition;
    },
    debounceInitOrUpdate: _.debounce(function () {
      this.initOrUpdate();
    }, 600),
  },
  computed: {
    title: function () {
      if (typeof this.conf === "undefined") {
        return "Empty Track";
      } else {
        return this.conf.title;
      }
    },
    gameover: function () {
      if (this.guesses.includes(1)) {
        
        return true;
      }
      else if ( this.isFinished ){
        return true;
      }
      else {
        return false;
      }
    },
    NumberOfTracks: function () {
      if (typeof this.player.playlist === "undefined") {
        return 0;
      } else {
        return this.player.playlist.tracks.length;
      }
    },
    cssProps() {
      var props = {};
      for (var i = 0; i < this.urls.length; ++i) {
        props["--track" + i.toString()] = this.trackColors[i];
      }
      return props;
    },
  },
  watch: {
    urls: {
      handler: "debounceInitOrUpdate",
    },
    guesses: {
      handler: "check_mute",
    },
},
};
</script>


<style>
.createdwith {
  margin-bottom: 0px;
  padding: 0px;
  position: absolute;
  bottom: -14px;
  right: 20px;
  color: white;
  font-size: 0.9em;
}

.createdwith a {
  color: #d3b719;
  text-decoration: none;
}

.playlist-tracks .track0 .track-header {
  background-color: var(--track0);
  color: white;
}

.playlist-tracks .track1 .track-header {
  background-color: var(--track1);
  color: white;
}

.playlist-tracks .track2 .track-header {
  background-color: var(--track2);
  color: white;
}

.playlist-tracks .track3 .track-header {
  background-color: var(--track3);
  color: white;
}

.playlist-tracks .track4 .track-header {
  background-color: var(--track4);
  color: white;
}

.playlist-tracks .track5 .track-header {
  background-color: var(--track5);
  color: white;
}

.playlist-tracks .track6 .track-header {
  background-color: var(--track6);
  color: white;
}

.playlist-tracks .track7 .track-header {
  background-color: var(--track7);
  color: white;
}

.playlist-tracks .track8 .track-header {
  background-color: var(--track8);
  color: white;
}

.playlist-tracks .track9 .track-header {
  background-color: var(--track9);
  color: white;
}
</style>