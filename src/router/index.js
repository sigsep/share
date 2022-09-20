import Vue from 'vue'
import SharedPlayer from "@/views/SharedPlayer.vue";
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/:id?/:embed?",
            name: "Player",
            component: SharedPlayer,
        }
    ]
 });

