<template>
  <div>
	<v-container align-items="center">
		<v-row align="center" justify="center">
			<v-btn loading rounded elevation="5" outlined width="200" height="100" href="http://82.65.87.54:3000/login">
				<img width="100" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42 Logo"/>
				AUTH
			</v-btn>
		</v-row>
		<v-btn @click="isLogged">test</v-btn>
	</v-container>

	</div>
</template>

<script>
export default {
	methods: {
		async isLogged(){
			// await fetch("http://82.65.87.54/users/logged")
			// .then(data => data.json())
			// .then((data) => {
			// 	console.log(data)
				//console.log(process.env.BACKEND_IP)
				// if (data.statusCode == 401)
				// console.log("yay")
			//}
			//)
		}
	}
}
</script>

<style>
</style>