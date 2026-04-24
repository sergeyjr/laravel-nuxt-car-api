// resources/js/router/index.js

import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/authStore'
import {useAlertStore} from '@/stores/alertStore'

import CarCreate from '@/pages/CarCreate.vue'
import CarShow from '@/pages/CarShow.vue'
import CarsIndex from '@/pages/CarsIndex.vue'
import Cart from '@/pages/Cart.vue'
import Contact from '@/pages/Contact.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import NotFound from '@/pages/NotFound.vue'
import Page from '@/pages/Page.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'

const routes = [

    {path: '/', name: 'home', component: Home},
    {path: '/cars', name: 'cars', component: CarsIndex},
    {path: '/cars/show/:id', name: 'car-show', component: CarShow},
    {path: '/cart', name: 'cart', component: Cart},
    {path: '/contact', name: 'contact', component: Contact},
    {path: '/dashboard', name: 'dashboard', component: Dashboard, meta: {requiresAuth: true}},
    {path: '/dashboard/car/create', name: 'dashboard-car-create', component: CarCreate, meta: {requiresAuth: true}},
    {path: '/dashboard/profile', name: 'dashboard-profile', component: Profile, meta: {requiresAuth: true}},
    {path: '/login', name: 'login', component: Login, meta: {guest: true}},
    {path: '/page/:code', name: 'page', component: Page},
    {path: '/register', name: 'register', component: Register, meta: {guest: true}},

    {path: '/not-found', name: 'not-found', component: NotFound},
    {path: '/:pathMatch(.*)*', redirect: '/not-found'}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.afterEach(() => {
    const alertStore = useAlertStore()
    alertStore.clear()
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    console.log('beforeEach')
    if (!auth.initialized) {
        await auth.initAuth()
    }
    if (to.meta.requiresAuth && !auth.user) {
        return {name: 'login'}
    }
    if (to.meta.guest && auth.user) {
        return {name: 'dashboard'}
    }
})

export default router
