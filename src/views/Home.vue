<template>
<v-app>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
       <v-container fill-height fluid>
         
                  <v-row align="center"
                        justify="center">
                    <v-col>
                      <v-card-text
                        class="text-center"
                        style="padding-left: 0px; padding-right: 0px"
                      >

                        <v-btn
                          v-on:click="$router.push('create')"
                          color="blue"
                          x-large
                        >
                          Create multi-track 
                        </v-btn>
                      </v-card-text>
                    </v-col>
                  </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>

<script>
export default {
  components: {},
  data: function () {
    return {
    }
  },
  mounted: function () {
  },
}
</script>