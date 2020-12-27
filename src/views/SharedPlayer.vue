<template>
    <v-app id='app' :dark="dark" >

        <v-app-bar
                app
                clipped-left
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>share.unmix.app</v-toolbar-title>
        </v-app-bar>

        <v-container fill-height fluid>
            <v-row align="center"
                   justify="center">
                <v-col>
                    <Player :key="combKey" :ref="player" :urls="tracklist" :conf="playerconf"></Player>
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
            dark: true,
            player: null,
            combKey: 42,
            playerconf: {
            },
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
                        { 'name': stem.name,
                          'customClass': "track" + index.toString(),
                        'solo': false,
                        'mute': false,
                        'src': stem.url
                    })
                }
                this.tracklist = trackstoload
            })
        }
    }
}
</script>
