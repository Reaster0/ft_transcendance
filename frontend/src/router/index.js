import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import SignUpForm from '../components/SignUpForm.vue'

const routes = [
	{
		path: '/',
		name: "Home",
		component: HomePage,
	},
	{
		path: '/signup',
		name: "SignUpForm",
		component: SignUpForm
	},
	{
		path: '/:catchAll(.*)',
		name: "404",
		component: NotFound,
	}
]
	const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router