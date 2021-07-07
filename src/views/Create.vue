<template>
  <v-app id='app' dark>
    <v-app-bar
      app
      clipped-left
    >
      <v-toolbar-title>share.unmix.app</v-toolbar-title>
      
    </v-app-bar>
    <v-content>
      <v-form dense>
      <v-container>
        <v-row dense>
          <v-col cols="12" md="1">
          <v-menu
              ref="titlecolormenu"
              v-model="titleColorMenu"
              :close-on-content-click="false"
            >
            <template v-slot:activator="{ on }">
              <v-btn icon fab v-on="on"><v-icon>mdi-palette</v-icon></v-btn>
            </template>
            <v-color-picker
              class="ma-2"
              v-model="playerconf.titleColor"
              v-if="titleColorMenu"
              @click="$refs.titlecolormenu.save(playerconf.titleColor)"
            >
            </v-color-picker>
            </v-menu>
         </v-col>
          <v-col dense cols="12" md="11">
            <v-text-field
              v-model="playerconf.title"
              label="Track title"
              solo dense
              :background-color="playerconf.titleColor"
              placeholder="Track title"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-sheet rounded="lg">
        <v-row v-for="(stem, index) in playerconf.streams"  v-bind:key="index">
          <v-col cols="12" md="1">
            <v-menu
              ref="stemmenu"
              v-model="stem.menu"
              :close-on-content-click="false"
            >
            <template v-slot:activator="{ on }">
              <v-btn icon fab v-on="on"><v-icon>mdi-palette</v-icon></v-btn>
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
          <v-col cols="12" md="2">
            <v-text-field
              v-model="stem.name"
              label="Source Name"
              solo dense
              :background-color="stem.color"
              placeholder="Source Name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="stem.url"
              label="URL"
              dense
              placeholder="URL"
              :rules="[rules.required, rules.url]"
              :prepend-icon="stem.is_dropbox ? 'mdi-dropbox' : ''"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="1">
            <v-switch
              v-model="stem.mute"
              label="mute"
              color="red"
              inset
              dense
            ></v-switch>
          </v-col>
          <v-col cols="12" md="1">
            <v-switch
              v-model="stem.solo"
              label="solo"
              color="green"
              inset
              dense
            ></v-switch>
          </v-col>
          <v-col>
            <v-btn
              v-on:click="closeButton(index)"
              color="red"
              small
              dense
              fab
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        </v-sheet>
        <p></p>
        <v-container>
        <v-row>
         <v-col cols="12" md="2">
            <v-switch
              v-model="playerconf.exclSolo"
              label="Switch mode"
            ></v-switch>
         </v-col>
         <v-col cols="12" md="9">
            Zoom: {{ Math.round((980 * (playerconf.zoom / 44100) + Number.EPSILON) * 10) / 10 }}s
            <v-slider
              v-model="playerconf.zoom"
              class="align-center"
              :max="8192"
              :min="224"
            >
            </v-slider>
          </v-col>
          <v-col cols="12" md="1">
            <v-btn
              v-on:click="addButton"
              color="primary"
              fab
              :disabled="allFilled"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
         </v-col>
        </v-row>

        </v-container>
      </v-container>
      </v-form>
    </v-content>
    <v-btn
        v-on:click="loadTracks"
        :disabled="allFilled || !allvalid || !confChanged"
        color="green"
      >
        Preview Track
    </v-btn>

    <v-content style="background-color: white; padding: 0px 10px 10px" v-if="showPlayer">
      <v-container fill-height>
        <v-row>
          <v-col cols="12" md="3">
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
         <v-col cols="12" md="3">
            <v-switch
              light
              v-model="embedSwitch"
              label="embed"
              dense
            ></v-switch>
         </v-col>
          <v-col cols="12" md="6">
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
      enableShare: true,
      confChanged: false,
      allvalid: false,
      routeId: "",
      titleColorMenu: false,
      embedSwitch: false,
      rules: {
        required: value => !!value || 'Required.',
        url: value => {
          return this.validURL(value) || 'Invalid URL.'
        },
      },
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
            menu: false,
            is_dropbox: false,
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
      this.confChanged = false
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
      this.enableShare = false
    },
  },
  computed: {
    embed: function () {
        if (this.embedSwitch) {
          return "/embed"
        } else {
          return ""
        }
    },
    shareURL: function () {
      return "https://share.unmix.app" + this.routeId + this.embed
    },
    playersize: function () {
      return 1.0
    },
    title: function () {
      return this.playerconf.title
    },
    allFilled: function () {
      return this.playerconf.streams.some( (stem) => (stem.url === "") )
    }
  },
  watch: {
    playerconf: {
      deep: true,
      handler() {
        this.confChanged = true
        this.allvalid = false
        for (const [index, stem] of this.playerconf.streams.entries()) {
          if (this.validURL(stem.url)) {
            this.allvalid = true
            this.enableShare = true
            // detect dropbox links
            if (stem.url.startsWith('https://www.dropbox.com/s')) {
              this.playerconf.streams[index].is_dropbox = true
              var slice = stem.url.split("/").slice(4, 6)
              stem.url = "https://dl.dropboxusercontent.com/s/" + slice[0] + "/" + slice[1]
            } else {
              if (stem.url.startsWith('https://dl.dropboxusercontent.com/s/')) {
                this.playerconf.streams[index].is_dropbox = true
              } else{
                this.playerconf.streams[index].is_dropbox = false
              }
            }
          }
          else {
            this.allvalid = false
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus">

.v-label {
  font-size: 1em;
}

.select {
  z-index: 1000
}

</style>
