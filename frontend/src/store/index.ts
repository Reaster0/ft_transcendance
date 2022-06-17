import { createStore } from 'vuex';
import { UserGlobal } from '../types/chat.types';

const store = createStore({
	state: {
		user: {
			nickname: "" as string,
			friends: [] as number[],
			status:	"" as string,
			eloScore: 1500 as number,
			is2FAEnabled: false as boolean,
		},
		connected: false as boolean,
		need2fa: false as boolean,
		// ----chat---- //
		channels: [] as any[],
		joinedChannel: false as boolean,
		theSocketVal: null as any,
		usersList: [] as UserGlobal[],
	},
	getters: {
		whoAmI:(state) => {
			return state.user;
		},
		isConnected:(state) => {
			return state.connected && !state.need2fa;
		},
		need2Fa:(state) => {
			return state.need2fa;
		},
		// ----chat---- //
		getChannels:(state) => {
			return state.channels;
		},
		isChannelJoined:(state) => {
			return state.joinedChannel;
		},
		getSocketVal:(state) => {
			return state.theSocketVal;
		},
		getUsersList:(state) => {
			return state.usersList;
		}
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setConnected(state, connected) {
			state.connected = connected[0];
			state.need2fa = connected[1];
		},
		setNeed2FA(state, TwoFA) {
			state.need2fa = TwoFA;
		},
		// ----chat---- //
		setChannels(state, chanarray) {
			state.channels = chanarray;
		},
		setChannelJoinedStatus(state, thestatus) {
			state.joinedChannel = thestatus;
		},
		setSocketVal(state, val) {
			state.theSocketVal = val;
		},
		setUsersList(state, val) {
			state.usersList = val;
		},
	},
	actions: {},
})



export default store
