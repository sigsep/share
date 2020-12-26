<template>
  <v-app id='app' :dark="dark" style="
    margin-left: 5%;
    margin-right: 5%;
  ">
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>share.unmix.app</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-form>
      <v-container
        v-if="showInsertForm"
        fluid
      >
        <v-row dense>
          <v-col dense cols="8" sm="8">
            <v-text-field
              v-model="playerconf.title"
              label="Track title"
              single-line
              solo
            ></v-text-field>
          </v-col>
          <v-col cols="4" sm="4">
            Waveform Zoom {{ playerconf.zoom }} Samples per Pixel
            <v-slider
              v-model="playerconf.zoom"
              class="align-center"
              :max="10240"
              :min="256"
            >
            </v-slider>
          </v-col>
        </v-row>
        <v-row v-for="stem in playerconf.streams">
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="stem.name"
              label="Source Name"
              single-line
              solo dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="stem.color"
              label="Color"
              single-line
              solo
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="stem.url"
              label="URL"
              single-line
              solo
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              v-on:click="addButton"
              color="pink"
              dark
              small
              :disabled="allFilled"
            >
              <v-icon>mdi-plus</v-icon>Add Track
            </v-btn>
        </v-col>
        <v-col>
          <v-btn
            v-on:click="loadTracks"
            color="green"
            dark
            small
            :disabled="allFilled"
          >
            <v-icon>mdi-arrow-right</v-icon> Preview Track
          </v-btn>
        </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-content>
    <v-divider></v-divider>
    <v-content style="background-color: rgb(48, 48, 48); padding: 0px 0px 0px" id="playerContainer">
      <v-container>
        <v-sheet
          v-if="showPlayer"
          margin="auto"
        >
            <Player :key="combKey" :ref="player" :urls="tracklist" :conf="playerconf"></Player>

          <v-btn
            v-on:click="insertTracks"
            color="blue"
            dark
            small
          >
            Share
          </v-btn>

          {{shareURL}}

        </v-sheet>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Player from './components/Player.vue'
import {db} from '@/main'

export default {
  name: 'App',
  components: { Player },
  data () {
    return {
      dark: true,
      player: null,
      combKey: 42,
      showPlayer: false,
      showInsertForm: true,
      shareURL: "",
      playerconf: {
        title: "My Track title",
        zoom: 1024,
        dark: true,
        streams: [
          {
            name: "vocals",
            url: "https://dl.dropboxusercontent.com/s/70r7pym621ayoe8/vocals.m4a",
            color: "#000000"
          },
          {
            name: "drums",
            url: "https://dl.dropboxusercontent.com/s/7dc94n728l9qm5t/drums.m4a",
            color: "#48bd75"
          },
          ]
      },
      trackstoload: [],
      tracklist: []
    }
  },
  mounted: function () {
    // get url
    var currentUrl = window.location.pathname;
    // if url is not null (?) go to firebase to get the tracks
    if(currentUrl != "/"){
      this.playerconf = {}
      db.collection('multitracks')
        .doc(currentUrl)
        .get()
        .then(snapshot => {
          const document = snapshot.data()
          this.playerconf.dark = document.dark
          this.playerconf.zoom = document.zoom
          this.playerconf.title = document.title
          this.playerconf.streams = []
          for(let i = 0; i < document.streams.length; i++){
            let s = document.streams[i]
            this.console.log(s)
            let stream = {name: s.name, url: s.url, color: s.color}
            this.playerconf.streams.push(stream)
            this.console.log(this.playerconf.streams)
          }
          this.showPlayer = true
          this.showInsertForm = false
        })
      this.console.log(this.playerconf)
    }
    // if null, present the fields to create player
  },
  created: function () {``

  },
  methods: {
    validURL (str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(str)
    },
    addButton (){
      this.playerconf.streams.push({url: ""})
    },
    loadTracks () {
      this.showPlayer = true
      this.combKey = Math.ceil(Math.random() * 10000)
      var trackstoload = []
      for (let stem of this.playerconf.streams) {
        trackstoload.push(
            { 'name': stem.name,
              'customClass': stem.name,
              'solo': false,
              'mute': false,
              'src': stem.url
          })
      }
      this.tracklist = trackstoload
    },
    async insertTracks () {
      var record = await db.collection("multitracks").add(this.playerconf)
      this.showInsertForm = false
      var currentUrl = window.location.pathname;
      this.console.log(currentUrl)
      this.shareURL = "http://localhost:8080/" + record.id
    },
  },
  computed: {
    title: function () {
      return this.playerconf.title
    },
    allFilled: function () {
      return this.playerconf.streams.some( (stem) => (stem.url === "") )
    }
  }

}
</script>

<style lang="stylus">

.select {
  z-index: 1000
}
</style>
