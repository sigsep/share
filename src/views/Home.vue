<template>
<v-app>
      <v-app-bar
      app
      clipped-left
    >
      <v-toolbar-title>share.unmix.app (beta)</v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn
          v-on:click="$router.push('create')"
          color="indigo lighten-1"
        >
        <v-icon>mdi-plus</v-icon>

        Create multi-track 
      </v-btn>
    </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
       <v-container fill-height fluid>
        <v-row align="center"
              justify="center">
          <v-col align="center">
              <img src="/hero.png" width="100%" alt="">
              <iframe style="max-width: 800px" width="100%" height="400px" src="https://share.unmix.app/nFngXqmpUIMVo9JCv3tc" frameborder="0"></iframe>
          </v-col>
        </v-row>
        </v-container>
      </v-main>
        <v-footer
    dark
    padless
  >
    <v-card
      flat
      tile
      class="indigo lighten-1 white--text text-center"
    >
      <v-card-text class="white--text pt-0 ma-2">
        Note that this service is provided free of charge by the sigsep open-source community. We do not collect any personal data except for the data that is added by the user. All data is anonimzed and contains no private information like IP addresses.
        We not have any legal right to the urls that will be shared with this service. The user must not use this service to share copyright protected material. We also provide no guarantee that the service is available or functional. Please use it at your own risk.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>sigsep</strong>
      </v-card-text>
    </v-card>
  </v-footer>
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