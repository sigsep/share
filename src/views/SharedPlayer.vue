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
import {db} from '@/main'
export default {
    name: 'SharedPlayer',
    components: { Player },
    data () {
        return {
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
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            var trackId = this.$route.params.id;

            db.collection('multitracks')
            .doc(trackId)
            .get()
            .then( snapshot => {
                const document = snapshot.data()
                var parsedDoc = JSON.parse(JSON.stringify(document))

                this.playerconf = parsedDoc

                this.combKey = Math.ceil(Math.random() * 10000)
                var trackstoload = []
                for (const [index, stem] of this.playerconf.streams.entries()) {
                    trackstoload.push(
                    { 
                        'name': stem.name,
                        'color': stem.color,
                        'customClass': "track" + index.toString(),
                        'solo': stem.solo,
                        'mute': stem.mute,
                        'src': stem.url
                    })
                }
                this.tracklist = trackstoload
            })
        }
    }
}
</script>


<style lang="stylus">

#player {
  z-index: -1000
}

</style>