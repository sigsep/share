<template>
  <v-app id='app' :dark="dark">
      <v-form>
      <v-container>
        <v-row v-for="stem in stems" v-bind:key="stem.name">
          <v-col cols="5" sm="5">
            <v-text-field
              v-model="stem.url"
              label="Regular"
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="stem.url"
              label="Regular"
              single-line
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-btn
            v-on:click="addButton"
            color="pink"
            fab
            dark
            small
            bottom 
            right
            :disabled="allFilled"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            v-on:click="loadTracks"
            color="green"
            fab
            dark
            small
            bottom 
            right
            :disabled="allFilled"
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-row>
      </v-container> 
    </v-form>
    <v-card
      color="dark-grey"
      dark
    >
        <Player :ref="player" :urls="tracklist" :dark="dark"></Player>

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
      player: null,
      stems: [
        { url: "" }
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
            { 'name': "S",
              'customClass': "S",
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