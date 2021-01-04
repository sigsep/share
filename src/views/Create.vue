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
      <v-container
        fluid
      >
        <v-row dense>
          <v-col dense cols="12" sm="12">
            <v-text-field
              v-model="playerconf.title"
              label="Track title"
              placeholder="Track title"
            ></v-text-field>
          </v-col>
<!--          <v-col cols="4" sm="4">-->
<!--            Waveform Zoom {{ playerconf.zoom }} Samples per Pixel-->
<!--            <v-slider-->
<!--              v-model="playerconf.zoom"-->
<!--              class="align-center"-->
<!--              :max="10240"-->
<!--              :min="256"-->
<!--            >-->
<!--            </v-slider>-->
<!--          </v-col>-->
        </v-row>
        <v-row justify="center" align="center" v-for="stem in playerconf.streams"  v-bind:key="stem">
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
          <v-col cols="12" sm="9">
            <v-text-field
              v-model="stem.url"
              label="URL"
              placeholder="URL"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" sm="6">
            <v-btn-toggle
          >
                <v-btn
                  v-on:click="addButton"
                  color="primary"
                  small
                  :disabled="allFilled"
                >
                  <v-icon>mdi-plus</v-icon>Add Track
                </v-btn>
              <v-btn
                v-on:click="loadTracks"
                color="green"
                small
                :disabled="allFilled"
              >
                <v-icon>mdi-arrow-right</v-icon> Preview Track
              </v-btn>

          </v-btn-toggle>
         </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-content>
    <v-content style="background-color: white; padding: 0px 10px 10px" v-if="showPlayer">
      <v-container>
        <v-container justify="center" align="center">
        <v-btn
                v-on:click="insertTracks"
                v-if="enableShare"
                color="blue"
                dark
                small
        >
          Share
        </v-btn>
      <router-link :to="routeId">{{"https://sigsep.github.io/"+routeId}}</router-link>

    </v-container>
        <v-sheet
          margin="auto"
          elevation="10"
        >
            <Player :key="combKey" :ref="player" :urls="tracklist" :conf="playerconf"></Player>
        </v-sheet>

      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Player from '@/components/Player.vue'
import {db} from '@/main'

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
      shareURL: "",
      playerconf: {
        title: "My Track title",
        zoom: 1024,
        dark: true,
        streams: [
          {
            name: "vocals",
            url: "https://dl.dropboxusercontent.com/s/70r7pym621ayoe8/vocals.m4a",
            color: "#000000",
            menu: false
          },
          {
            name: "drums",
            url: "https://dl.dropboxusercontent.com/s/7dc94n728l9qm5t/drums.m4a",
            color: "#48bd75",
            menu: false
          },
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
      this.playerconf.streams.push(
        {
          name: "",
          url: "",
          color: "#" + Math.floor(Math.random()*16777215).toString(16),
          menu: false
        }
      )
    },
    loadTracks () {
      this.showPlayer = true
      this.combKey = Math.ceil(Math.random() * 10000)
      var trackstoload = []
      for (const [index, stem] of this.playerconf.streams.entries()) {
        trackstoload.push(
            { 'name': stem.name,
              'waveOutlineColor': stem.color,
              'customClass': "track" + index.toString(),
              'solo': false,
              'mute': false,
              'src': stem.url
          })
      }
      this.tracklist = trackstoload
    },
    async insertTracks () {
      var record = await db.collection("multitracks").add(this.playerconf)
      this.routeId = "/" + record.id  // TODO: get real url from router
      this.enableShare = false
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
