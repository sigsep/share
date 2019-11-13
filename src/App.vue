<template>
  <v-app id='app' :dark="dark">
    <v-app-bar
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-form>
      <v-container fluid>
        {{stems}}
          <v-text-field
              v-model="title"
              label="Track title"
              single-line
          ></v-text-field>

        <v-row v-for="stem in stems">
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="stem.name"
              label="Source Name"
              single-line
              solo dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-text-field
              v-model="stem.color"
              label="Color"
              single-line
              solo
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="9">
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
          <v-btn
            v-on:click="addButton"
            color="pink"
            dark
            small
            :disabled="allFilled"
          >
            <v-icon>mdi-plus</v-icon>Add Track
          </v-btn>
          <v-btn
            v-on:click="loadTracks"
            color="green"
            dark
            small
            :disabled="allFilled"
          >
            <v-icon>mdi-arrow-right</v-icon> Preview Track
          </v-btn>
        </v-row>
      </v-container> 
    </v-form>
      </v-content>
    <v-card
      color="dark-grey"
      dark
    >
      <Player :ref="player" :urls="tracklist" :title="title" :dark="dark"></Player>
    </v-card>
  </v-app>
</template>

<script>
import Player from './components/Player.vue'
import axios from 'axios'


export default {
  name: 'App',
  components: { Player },
  data () {
    return {
      dark: true,
      title: "",
      player: null,
      stems: [
        { 
          name: "test",
          url: "https://dl.dropboxusercontent.com/s/3y0fnh2il9uchel/Marvin%20Gaye%20-%20I%20Heard%20It%20Through%20The%20Grapevine.mp3",
          color: "#000000"
        }
      ],
      trackstoload: [],
      tracklist: []
    }
  },
  mounted: function () {
    // this.fetchData();
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
      this.stems.push({url: ""})
    },
    fetchData (){
     axios.get(this.baseUrl + 'headers.json').then(response => {
        this.stems = response.data.stems
        this.selectedTrack = response.data.selected_track
        this.dark = response.data.dark
     })
    },
    loadTracks () {
      var trackstoload = []
      for (let stem of this.stems) {
        trackstoload.push(
            { 'name': stem.name,
              'customClass': stem.name,
              'solo': false,
              'mute': false,
              'src': stem.url
          })
      }
      this.tracklist = trackstoload
    }
  },
  computed: {
    allFilled: function () {
      return this.stems.some( (stem, index) => (stem.url === "") )
    }
  }

}
</script>

<style lang="stylus">

.select {
  z-index: 1000
}
</style>