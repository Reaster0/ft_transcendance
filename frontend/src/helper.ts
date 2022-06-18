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

async function imgToBuffer(event: any) {
	let file = null as any;
	if (event.target.files && event.target.files.length != 0) {
		const img = event.target.files[0];
		if (!img.type.match(/\/(jpg|jpeg|png|gif)$/)) {
			alert('Image must be a jpg, jpeg, png or gif file.')
			return null;
		} else if (img.size > (1024 * 1024)) {
			alert('Image is too big.')
			return null;
		}
		await img.arrayBuffer().then(function(buff: any) {
			file = new Uint8Array(buff);
		});
	} else {
		alert('Image can\'t be uploaded.');
		return null;
	}
	return file;
}

export { leaveChat, verifyChannelName, imgToBuffer };
