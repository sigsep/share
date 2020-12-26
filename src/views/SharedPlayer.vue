<template>
    <v-sheet>
      <v-card
        max-width="900"
        class="mx-auto"
        color="dark-grey"
        dark
      >
        <Player :key="combKey" :ref="player" :urls="tracklist" :conf="playerconf"></Player>
      </v-card>
    </v-sheet>
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
            })
        }
    }
}
</script>