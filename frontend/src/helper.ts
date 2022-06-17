import { Store } from 'vuex';

function leaveChat(socket: any, to: any, next: any, store: Store<any>) {
	if (to.name === 'Chat' || to.name === 'NewRoom' || to.name === 'PublicRoom'
		|| to.name === 'PrivateRoom' || to.name === 'ProtectedRoom'
		|| to.name === 'ChangeRoom' || to.name === 'ManageUsers') {
			next(true);
			return;
	}
	const answer = window.confirm("Are you sure you want to leave the chat ?")
	if (answer) {
			console.log('disconnection from chat');
		socket.disconnect();
		store.commit('setSocketVal' , null);
		next(true);
		return;
	}
	next(false);	
}

function verifyChannelName (name: string) {
	if (name === '') {
		alert("Your channel name can't be empty.");
        return false;
    } else if (name.length > 10) {
		alert("Your channel name can't be more than 10 characters.")
		return false;
	} else if (/^([a-zA-Z0-9-]+)$/.test(name) === false) {
		alert("Your channel name must only contains digits or letters.")
		return false;
	}
	return true;
}

export { leaveChat, verifyChannelName };
