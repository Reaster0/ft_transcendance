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
		chatSocket: null as any,
		gameSocket: null as any,
		opponentSocketId: null as any,
		watchGame: null as any,
		userToManage: null as any,
		currentChannelId: null as any,
		currentChannelType: null as any,
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
		getChatSocket:(state) => {
			return state.chatSocket;
		},
		getGameSocket:(state) => {
			return state.gameSocket;
		},
		getOpponentSocketId:(state) => {
			return state.opponentSocketId;
		},
		getWatchGame:(state) => {
			return state.watchGame;
		},
		getUserToManage:(state) => {
			return state.userToManage;
		},
		getCurrentChannelId:(state) => {
			return state.currentChannelId;
		},
		getCurrentChannelType:(state) => {
			return state.currentChannelType;
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
		setChatSocket(state, val) {
			state.chatSocket = val;
		},
		setGameSocket(state, val) {
			state.gameSocket = val;
		},
		setOpponentSocketId(state, val) {
			state.opponentSocketId = val;
		},
		setWatchGame(state, val) {
			state.watchGame = val;
		},
		setUserToManage(state, val) {
			state.userToManage = val;
		},
		setCurrentChannelId(state, val) {
			state.currentChannelId = val;
		},
		setCurrentChannelType(state, val) {
			state.currentChannelType = val;
		},
	},
	actions: {},
})



export default store
