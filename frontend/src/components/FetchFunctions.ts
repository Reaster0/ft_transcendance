//all functions here return the results or NULL

///mmmh redness
export async function isLogged() {
	console.log("check if user is logged")
	return await fetch(process.env.VUE_APP_BACKEND + "/users/logged", {credentials: "include"})
	.then(res => {
		if (res.status == 200)
			return [true, false];
		if (res.status == 418)
			return [true, true];
		return [false, false]
	})
}

export async function getUserInfo() {
	console.log("get user info")
	return await fetch(process.env.VUE_APP_BACKEND + "/users/currentUser", {credentials: "include"})
	.then(data => data.json())
	.then((data) => {
		return data.statusCode == 403? null : data 
	})
}

export async function getInitialQR() {
	console.log("launching getQR")
	return await fetch(process.env.VUE_APP_BACKEND + "/auth/2FAGenQRC", {credentials: "include", method: "POST"})
	.then(res => {
		return res.status == 401? null : res.blob()})
	.then(blob => {
		return blob? URL.createObjectURL(blob) : blob
	})
}

export async function submit2FaCode(inputCode: string) {
	console.log("launching submit2FaCode")
	return await fetch(process.env.VUE_APP_BACKEND + "/auth/login-2fa", {
		credentials: "include",
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ twoFACode: inputCode })})
	.then(res => {
		return res.status == 201? true : false 
	})
}

export async function getAvatarID(id: number) {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/getAvatar/" + id, {credentials: "include"})
	.then(res => {
		return res.status != 200? null : res.blob()})
	.then(blob => {
		return blob? URL.createObjectURL(blob) : blob
	})
}

export async function getHistoryID(id: number) {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/getHistory/" + id, {credentials: "include"})
	.then(res => {
		return res.status != 200? null : res.json()
	})
}

export async function updateUser(nick: string, oldnick: string | null) {


	// better clean on server side
	if (
		!nick
		|| nick === oldnick
		|| nick.length < 4
		|| nick.length > 15
		|| !nick.match(/^[a-z0-9A-Z]+$/i) == null) {
		return false;
	}
	console.log('new nickname pass the tests');
	return await fetch(process.env.VUE_APP_BACKEND + "/users/settings", {
		credentials: "include",
		method: "PATCH",
		body: JSON.stringify({
			nickname: nick,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	.then(res => {
		return res.status == 200? true : false
	})
}

export async function uploadAvatar(file: any) {
	const formData = new FormData()
	formData.append('avatar', file.target.files[0])
	return await fetch(process.env.VUE_APP_BACKEND + "/users/uploadAvatar", {
		credentials: "include",
		method: "POST",
		body: formData
		})
	.then((res)=>{
		return res.status == 201? true : false 
	})
}

export async function getFriendsList() {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/listFriends", { credentials: "include", method: "POST"})
		.then(res => res.json())
		.then(res => {
			return res
		})
}

export async function addFriend(nickName: string) {
	console.log(nickName);
	return await fetch(process.env.VUE_APP_BACKEND + "/users/addFriend", {
		credentials: "include",
		method: "PATCH",
		body: JSON.stringify({ nickname: nickName}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	.then(res => {
		return res.status
	})
}

export async function removeFriend(nickName: string) {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/removeFriend", {
		credentials: "include",
		method: "PATCH",
		body: JSON.stringify({ nickname: nickName}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	.then(res => {
		return res.status
	})
}

export async function getUserInfos(nickName: string) {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/partialInfo?" + new URLSearchParams({nickname: nickName})
	, {method: 'POST', credentials: "include"})
	.then(res => res.json())
}

export async function isMyFriend(id : number) {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/isMyFriend/" + id, {credentials: "include"})
	.then(res => res.json())
}

export async function genJoinLink(channelId: string) {
	return await fetch(process.env.VUE_APP_BACKEND + '/chat/genJoinUrl?' + new URLSearchParams({chanId: channelId}),
	{
		method: 'get',
		credentials: 'include'
	}).then(function(body){return body.text()});
}

export async function getUsers() {
	return await fetch(process.env.VUE_APP_BACKEND + "/users/getUsers", { method: "GET", credentials: "include"})
	.then(res => res.json())
}

export async function disableTwoFA() {
	return await fetch(process.env.VUE_APP_BACKEND + "/auth/disableTwoFA", {
		credentials: "include",
		method: "PATCH"
	})
}
