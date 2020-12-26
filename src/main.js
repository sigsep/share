import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'
import router from './router'


firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')