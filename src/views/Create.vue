<template>
  <v-app id='app' :dark="dark">
    <v-app-bar
      app
      clipped-left
    >
      <v-toolbar-title>share.unmix.app</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-form>
      <v-container>
        <v-row dense>
          <v-col dense cols="12" sm="12">
            <v-text-field
              v-model="playerconf.title"
              label="Track title"
              placeholder="Track title"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="center" align="center" v-for="(stem, index) in playerconf.streams"  v-bind:key="index">
          <v-col cols="12" sm="1">
            <v-menu
              ref="stemmenu"
              v-model="stem.menu"
              :close-on-content-click="false"
            >
            <template v-slot:activator="{ on }">
            <v-btn :color="stem.color" v-on="on"></v-btn>
            </template>
            <v-color-picker
              class="ma-2"
              v-model="stem.color"
              v-if="stem.menu"
              @click="$refs.stemmenu.save(stem.color)"
            >
            </v-color-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="stem.name"
              label="Source Name"
              placeholder="Source Name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="stem.url"
              label="URL"
              placeholder="URL"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-switch
              v-model="stem.mute"
              label="mute"
            ></v-switch>
          </v-col>
          <v-col cols="12" sm="1">
            <v-switch
              v-model="stem.solo"
              label="solo"
            ></v-switch>
          </v-col>
          <v-col>
            <v-btn
              v-on:click="closeButton(index)"
              color="red"
              small
              fab
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="2">
            <v-btn
              v-on:click="addButton"
              color="primary"
              :disabled="allFilled"
            >
              <v-icon>mdi-plus</v-icon>Add
            </v-btn>
         </v-col>

          <v-col cols="12" sm="2">
            <v-btn
              v-on:click="loadTracks"
              :disabled="allFilled"
              color="green"
            >
              <v-icon>mdi-arrow-down</v-icon> Preview
            </v-btn>
         </v-col>
         <v-col cols="12" sm="2">
            <v-switch
              v-model="playerconf.exclSolo"
              label="Solo switch-mode"
            ></v-switch>
         </v-col>
         <v-col cols="12" sm="2">
          <v-menu
              ref="titlecolormenu"
              v-model="titleColorMenu"
              :close-on-content-click="false"
            >
            <template v-slot:activator="{ on }">
              <v-btn  :color="playerconf.titleColor" v-on="on"></v-btn>
            </template>
            <v-color-picker
              class="ma-2"
              v-model="playerconf.titleColor"
              v-if="titleColorMenu"
              @click="$refs.titlecolormenu.save(playerconf.titleColor)"
            >
            </v-color-picker>
            </v-menu>
            Title Color
         </v-col>
         <v-col cols="12" sm="3">
            Visible excerpt: {{ Math.round((980 * (playerconf.zoom / 44100) + Number.EPSILON) * 10) / 10 }}s
            <v-slider
              v-model="playerconf.zoom"
              class="align-center"
              :max="8192"
              :min="224"
            >
            </v-slider>
          </v-col>

        </v-row>
      </v-container>
      </v-form>
    </v-content>
    <v-content style="background-color: white; padding: 0px 10px 10px" v-if="showPlayer">
      <v-container fill-height>
        <v-row>
          <v-col>
            <v-btn
              v-on:click="insertTracks"
              v-if="enableShare"
              style="margin-right: 0em"
              color="primary"
              left
              large
            >
              Share
            </v-btn>
          </v-col>
          <v-col>
            <v-text-field
              :value="shareURL"
              light
              :disabled="enableShare"
              outlined
              label="Share URL"
              readonly
              ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center"
            justify="center">
            <v-col>
              <v-sheet
                margin="auto"
                elevation="10"
              >
                  <Player ref="player" :key="combKey" :urls="tracklist" :conf="playerconf"></Player>
              </v-sheet>
            </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Player from '@/components/Player.vue'
import {db} from '@/main'

const codec = require('json-url')('lzw')

export default {
  name: 'Home',
  components: { Player },
  data () {
    return {
      dark: true,
      player: null,
      combKey: 42,
      showPlayer: false,
      previewDisabled: false,
      enableShare: true,
      shareURL: "",
      routeId: "",
      titleColorMenu: false,
      playerconf: {
        title: "My Track title",
        zoom: 990,
        titleColor: "#666666",
        dark: true,
        exclSolo: false,
        streams: [
          {
            name: "vocals",
            url: "",
            color: "#000000",
            mute: false,
            solo: false,
            menu: false
          }
          ]
      },
      trackstoload: [],
      tracklist: []
    }
  },
  mounted: function () {
  },
  created: function () {
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
    // processURL (str) {
      // TODO: 1) identify dropbox share 2) light up button 3) on button press, convert url
        // https://www.dropbox.com/s/xsnkutho5wj4xko/vocals.flac?dl=0
        // var str = "https://dl.dropboxusercontent.com/s/7dc94n728l9qm5t/drums.m4a";
        // var res = str.split("/").slice(4, 6);
    // },
    addButton (){
      if (this.playerconf.streams.length <= 10) {
        this.playerconf.streams.push(
          {
            name: "",
            url: "",
            color: "#" + Math.floor(Math.random()*16777215).toString(16),
            menu: false
          }
        )
      }
    },
    closeButton (index){
        this.playerconf.streams.splice(index, 1)
    },
    loadTracks: _.debounce(function() {
      this.showPlayer = true
      this.combKey = Math.ceil(Math.random() * 10000)
      var trackstoload = []
      for (const [index, stem] of this.playerconf.streams.entries()) {
        trackstoload.push(
            { 'name': stem.name,
              'color': stem.color,
              'customClass': "track" + index.toString(),
              'solo': stem.solo,
              'mute': stem.mute,
              'src': stem.url
          })
      }
      this.tracklist = trackstoload
    }, 600),
    async insertTracks () {
      // TODO: set a flag for is_loaded
      var record = await db.collection("multitracks").add(this.playerconf)
      codec.compress(this.playerconf).then(result => console.log(result))
      this.routeId = "/" + record.id  // TODO: get real url from router
      this.shareURL = "https://share.unmix.app" + this.routeId
      this.enableShare = false
    },
  },
  computed: {
    playersize: function () {
      return 1.0
    },
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
