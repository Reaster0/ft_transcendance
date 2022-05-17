import {createStore} from "vuex"

const store = createStore({
	state: {
		user: {
			id:	0,
			nickname:	"",
			username:	"",
			email:	"",
			twoFASecret:	null,
			is2FAEnabled:	false,
			friends:	[],
			status:	"",
			eloScore:	0,
		},
		connected: false,
	},
	getters: {
		whoIAm:(state) => {
			return state.user;
		},
		isConnected:(state) => {
			return state.connected;
		},
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setConnected(state, connected) {
			state.connected = connected;
		}
	},
	actions: {},
})

export default store