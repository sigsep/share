<template>
    <v-app class="ma-0 pa-0" style="background-color: white;">
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
                    <p style="margin-top: 10px; color: black">Created with share.unmix.app</p>
                </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-app>

</template>

<script>
import Player from '@/components/Player.vue'
import {db} from '@/main'
export default {
    name: 'SharedPlayer',
    components: { Player },
    data () {
        return {
            dark: false,
            player: null,
            combKey: 42,
            playerconf: {},
            trackstoload: [],
            tracklist: []
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