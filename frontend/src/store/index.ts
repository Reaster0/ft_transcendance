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
		socketVal: null as any,
		usersList: [] as UserGlobal[],
		userToManage: null as any,
		currentChannelId: null as any,
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
			return state.socketVal;
		},
		getUsersList:(state) => {
			return state.usersList;
		},
		getUserToManage:(state) => {
			return state.userToManage;
		},
		getCurrentChannelId:(state) => {
			return state.currentChannelId;
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
			state.socketVal = val;
		},
		setUsersList(state, val) {
			state.usersList = val;
		},
		setUserToManage(state, val) {
			state.userToManage = val;
		},
		setCurrentChannelId(state, val) {
			state.currentChannelId = val;
		},
	},
	actions: {},
})



export default store
