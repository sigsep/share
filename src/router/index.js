import Vue from 'vue'
import Home from "@/views/Home.vue";
import Create from "@/views/Create.vue";
import SharedPlayer from "@/views/SharedPlayer.vue";
import Stemle from "@/views/Stemle.vue";
import Router from 'vue-router'


Vue.use(Router)


 export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            name: "Home",
            component: Home,
        },
        {
            path: "/create",
            name: "Create",
            component: Create,
        },
        {
            path: "/:id",
            name: "Stemle",
            component: Stemle,
        }
    ]
 });

