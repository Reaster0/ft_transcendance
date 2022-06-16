import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import NotFound from '../views/NotFound.vue'
import LoginPage from "../views/LoginPage.vue";
// import UserPage from "../views/UserPage.vue";
import TwoAuth from "../views/TwoAuthPage.vue";
import TheGame from "../views/TheGame.vue";
// import EditUser from "../views/EditUser.vue";
import Chat from "../views/Chat_main.vue";
import NewRoom from "../views/Chat_createroom.vue";
import NewRoomPublic from "../views/Chat_publicroom.vue";
import NewRoomPrivate from "../views/Chat_privateroom.vue";
import NewRoomProtected from "../views/Chat_protectedroom.vue";
import MU from "../views/Chat_manageusers.vue";
import ChangeRoom from "../views/Chat_roomsettings.vue";
import { isLogged, getUserInfo } from "../components/FetchFunctions"
import store from "../store/index"
import UserPagev2 from "../views/UserPagev2.vue";
import FriendList from "../views/FriendList.vue";
import RedirectTrick from "../components/RedirectTrick.vue";

const routes = [
	{
		path: '/',
		name: "Home",
		component: HomePage,
	},
	{
		path: '/login',
		name: "login",
		component: LoginPage,
		beforeEnter: () => {
			return !store.getters.isConnected? true: "/"
		}
	},
	{
		path: '/:catchAll(.*)',
		name: "404",
		component: NotFound,
	},
	{
		path: '/user',
		name: "user",
		component: UserPagev2,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/2auth',
		name: "twoAuth",
		component: TwoAuth,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/game',
		name: "TheGame",
		component: TheGame,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/user/friends',
		name: "friendList",
		component: FriendList,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/user/:username',
		name: 'userInfo',
		component: UserPagev2,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/redirect',
		name: 'redirect',
		component: RedirectTrick,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	// {
	// 	path: '/chat',
	// 	name: "chat",
	// 	component: TheChat,
	// 	beforeEnter: () => {
	// 		return store.getters.isConnected? true: "/login"
	// 	}
	// },
	{
		path: '/thechat',
		name: "Chat",
		component: Chat,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		},
	},
	{
		path: '/newroom',
		name: "NewRoom",
		component: NewRoom,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/publicroom',
		name: "PublicRoom",
		component: NewRoomPublic,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/privateroom',
		name: "PrivateRoom",
		component: NewRoomPrivate,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/protectedroom',
		name: "ProtectedRoom",
		component: NewRoomProtected,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/roomsettings',
		name: "ChangeRoom",
		component: ChangeRoom,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
	{
		path: '/mu',
		name: "ManageUsers",
		component: MU,
		beforeEnter: () => {
			return store.getters.isConnected? true: "/login"
		}
	},
]

const router = createRouter({
history: createWebHistory(process.env.BASE_URL),
routes
})


router.beforeEach(async() => {
	store.commit('setConnected', await isLogged())
	if (store.getters.isConnected) {
		store.commit('setUser', await getUserInfo())
	}
})

export default router
