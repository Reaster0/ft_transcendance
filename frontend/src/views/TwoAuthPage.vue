<template>
	<v-container>
		<h1>Auth</h1>
		<h1>{{user}}</h1>
				<!-- <v-card>User ID: {{user.id}}</v-card>
				<v-card>nickname: {{user.nickname}}</v-card>
				<v-card>username: {{user.username}}</v-card>
				<v-card>email: {{user.email}}</v-card>
				<v-card>Elo: {{user.eloScore}}</v-card>
				<v-card>Connected: {{user.status}}</v-card>
				<v-card>has 2fa: {{user.is2FAEnabled}} and 2fa secret: {{user.twoFASecret}}</v-card> -->
	</v-container>
</template>

<script>
import { onMounted } from "vue"

export default {
	props: {
		user:{
			type: Object,
			required: true,
		},
	},
	setup(){
		
		onMounted(() =>{
			console.log("lol")
		})

		return {onMounted}
	},
}
</script>

<style>

</style>