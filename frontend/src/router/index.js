import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import LoginPage from "../views/LoginPage.vue";
import UserPage from "../views/UserPage.vue";
import TwoAuth from "../views/TwoAuthPage.vue";

const routes = [
	{
		path: '/',
		name: "Home",
		component: HomePage,
	},
	{
		path: '/login',
		name: "login",
		component: LoginPage
	},
	{
		path: '/:catchAll(.*)',
		name: "404",
		component: NotFound,
	},
	{
		path: '/user',
		name: "user",
		component: UserPage
	},
	{
		path: '/2auth',
		name: "twoAuth",
		component: TwoAuth
	},
]
	const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router