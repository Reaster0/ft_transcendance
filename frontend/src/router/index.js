import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import LoginPage from "../views/LoginPage.vue";
import UserPage from "../views/UserPage.vue";
import TwoAuth from "../views/TwoAuthPage.vue";
import TheGame from "../views/TheGame.vue";
import Chat from "../views/TransChat_group.vue";
import ChatPerson from "../views/TransChat_person.vue";
import NewRoom from "../views/TransChat_create_room.vue";
import MU from "../views/TransChat_manage_users.vue";
import ADM from "../views/TransChat_groupchat_adminside.vue";
import ChangeRoom from "../views/TransChat_change_room.vue";

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
	{
		path: '/game',
		name: "TheGame",
		component: TheGame
	},
	{
		path: '/chatgroup',
		name: "transchatgroup",
		component: Chat
	},
	{
		path: '/chatperson',
		name: "transchatperson",
		component: ChatPerson
	},
	{
		path: '/newroom',
		name: "newroom",
		component: NewRoom
	},
	{
		path: '/roomsettings',
		name: "changeroom",
		component: ChangeRoom
	},
	{
		path: '/mu',
		name: "manageusers",
		component: MU
	},
	{
		path: '/adm',
		name: "groupchat_adminside",
		component: ADM
	},
]
	const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
}

)

export default router