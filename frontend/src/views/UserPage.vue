<template>
<v-container>
	<v-container v-if="user" >
		<v-row justify="center">
			<v-col cols="5">
				<v-card>User ID: {{user.id}}</v-card>
				<v-card>nickname: {{user.nickname}}</v-card>
				<v-card>username: {{user.username}}</v-card>
				<v-card>email: {{user.email}}</v-card>
				<v-card>Elo: {{user.eloScore}}</v-card>
				<v-card>Connected: {{user.status}}</v-card>
				<v-card>has 2fa: {{user.is2FAEnabled}} and 2fa secret: {{user.twoFASecret}}</v-card>
			</v-col>
		</v-row>
	</v-container>
	<v-container>
		<v-row justify="center" align-content="space-around">
			<v-btn height="150" width="150" elevation="2" icon outlined to="/2auth" user="user">
				<v-img src="https://pic.onlinewebfonts.com/svg/img_363569.png"/>
			</v-btn>
		</v-row>
		<v-row justify="center">
			<h1 justify="center">2fa Connect</h1>
		</v-row>
	</v-container>
</v-container>
</template>

<script>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core'

export default {
	setup(){
		const user = ref(null)

		onMounted(async() =>{
			user.value = await fetch("api/users/1").then(res => res.json())
			.catch(err => console.log(err))
		})

		return {user,}
	}
}
</script>

<style>

</style>