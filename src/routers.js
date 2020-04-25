import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./views/home.vue')
    },
    {
        path: '/category',
        name: 'category',
        component: () => import('./views/category.vue')
    },
    {
        path: '/epg',
        name: 'epg',
        component: () => import('./views/epg.vue')
    },
    {
        path: '/epg/item/:id',
        name: 'epgitem',
        props: true,
        component: () => import('./views/epgItem.vue')
    }
]

const router = new VueRouter({
    routes
});

export default router
