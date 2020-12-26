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
        <v-row v-for="stem in playerconf.streams">
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="stem.name"
              label="Source Name"
              placeholder="Source Name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="stem.color"
              label="Color"
              placeholder="Color"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="stem.url"
              label="URL"
              placeholder="URL"
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
        v-if="enableShare"
        color="blue"
        dark
        small
      >
        Share
      </v-btn>

      <router-link :to="routeId">{{"http://localhost:8080/#"+routeId}}</router-link>

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
      this.routeId = "/id/" + record.id
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
