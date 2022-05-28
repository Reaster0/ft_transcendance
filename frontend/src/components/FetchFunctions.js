//all functions here return the results or NULL

export async function isLogged() {
	console.log("check if user is logged")
	return await fetch("/api/users/logged", {credentials: "include"})
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
	return await fetch("/api/users/currentUser", {credentials: "include"})
	.then(data => data.json())
	.then((data) => {
		return data.statusCode == 403? null : data 
	})
}

export async function getInitialQR() {
	console.log("launching getQR")
	return await fetch("/api/auth/2FAGenQRC", {credentials: "include", method: "POST"})
	.then(res => {
		return res.status == 401? null : res.blob()})
	.then(blob => {
		return blob? URL.createObjectURL(blob) : blob
	})
}

export async function submit2FaCode(inputCode) {
	console.log("launching submit2FaCode")
	return await fetch("/api/auth/login-2fa", {
		credentials: "include",
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ twoFACode: inputCode })})
	.then(res => {
		console.log(res)
		return res.status == 201? true : false 
	})
}

export async function getAvatarID(id) {
	return await fetch("/api/users/getAvatar/" + id, {credentials: "include"})
	.then(res => {
		return res.status != 200? null : res.blob()})
	.then(blob => {
		return blob? URL.createObjectURL(blob) : blob
	})
}

export async function updateUser(nick, mail) {
	return await fetch("/api/users/settings", {
		credentials: "include",
		method: "PATCH",
		body: JSON.stringify({
			nickname: nick,
			email: mail
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	.then(res => {
		console.log(JSON.stringify({
			nickname: nick,
			email: mail
		}))
		return res.status == 200? true : false
	})
}