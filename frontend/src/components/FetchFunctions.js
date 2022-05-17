export async function isLogged() {
	return await fetch("/api/users/logged", {credentials: "include"})
	.then(data => data.json())
	.then((data) => {
		return data.statusCode == 401? false : true
	})
}