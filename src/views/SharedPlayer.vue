<template>
    <div>
    <template dark v-if="embed">
        <v-app class="ma-0 pa-0">
        <v-container class="ma-0 pa-0" fluid>
            <v-row>
                <v-col style="padding-bottom: 0px">
                <v-container class="ma-0 pa-0" fluid> 
                    <v-sheet
                    margin="auto"
                    elevation="10"
                    >
                        <Player :key="combKey" :ref="player" :urls="tracklist" :conf="playerconf"></Player>
                    </v-sheet>
                </v-container>
                </v-col>
            </v-row>
        </v-container>
        </v-app>
    </template>
    <template v-else>
        <v-app class="ma-0 pa-0">
            <v-container class="ma-0 pa-0" fill-height fluid>
            <v-row align="center"
                   justify="center">
                <v-col>
                <v-container>
                    <v-sheet
                    margin="auto"
                    elevation="10"
                    >
                        <Player :key="combKey" :ref="player" :urls="tracklist" :conf="playerconf"></Player>
                    </v-sheet>
                </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
    </template>
    </div>
</template>

<script>
import Player from '@/components/Player.vue'
import axios from 'axios'

export default {
    name: 'SharedPlayer',
    components: { Player },
    data () {
        return {
            info: [],
            player: null,
            combKey: 42,
            playerconf: {},
            trackstoload: [],
            tracklist: []
        }
    },
    computed: {
        embed() {
            // We will see what `params` is shortly
            if ( this.$route.params.embed === 'embed') {
                return true
            }
            else {
                return false
            }
        }
    },
    created() {
        this.fetchData()
        this.playerconf.zoom = 400
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            axios
            .get('http://localhost:3000/track/' + this.$route.params.id)
            .then(response => {
                this.info = response.data
                // this.combKey = Math.ceil(Math.random() * 10000)
                var trackstoload = [];
                for (const [index, stem] of this.info.entries()) {
                    trackstoload.push(
                    { 
                        'name': stem.name,
                        'color': "#" + Math.floor(Math.random()*16777215).toString(16),
                        'customClass': "track" + index.toString(),
                        'solo': false,
                        'mute': false,
                        'src': 'http://localhost:3000' + stem.path
                    })
                }
                this.tracklist = trackstoload
            })
            .catch(error => console.log(error))

        }
    }
}
</script>


<style lang="stylus">

#player {
  z-index: -1000
}

</style>