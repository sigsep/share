import Vue from 'vue'
import Home from "@/views/Home.vue";
import SharedPlayer from "@/views/SharedPlayer.vue";
import Router from 'vue-router'


Vue.use(Router)


 export default new Router({
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        {
            path: "/id/:id",
            name: "SharedPlayer",
            component: SharedPlayer,
        }
    ]
 });

