<template>
<v-container>
	<v-container v-if="user" >
		<v-row>
			<v-col align="center">
				<h3>User ID: {{user.id}}</h3>
				<h3>nickname: {{user.nickname}}</h3>
				<h3>username: {{user.username}}</h3>
				<h3>email: {{user.email}}</h3>
				<h3>Elo: {{user.eloScore}}</h3>
				<h3>Connected: {{user.status}}</h3>
				<h3>has 2fa: {{user.is2FAEnabled}}</h3>
				<h3>and 2fa secret: {{user.twoFASecret}}</h3>
			</v-col>
		</v-row>
	</v-container>
	<v-container>
		<v-row justify="center" align-content="space-around">
			<v-btn height="150" width="150" elevation="2" icon outlined to="/2auth" user="user">
				<v-img src="../assets/qr-code-logo.png"/>
			</v-btn>
		</v-row>
		<v-row justify="center">
			<h1>Enable 2FA</h1>
		</v-row>
		<v-row justify="center">
			<v-text-field @keydown.enter="submitCode" v-model="inputCode" label="2FA Code for testing purpose" color="white"></v-text-field>
			<h1 v-if="codeAccepted">Code Accepted!</h1>
		</v-row>
	</v-container>
</v-container>
</template>

<script>
import { useStore } from "vuex"
import { computed } from "@vue/runtime-core"
import { ref } from "vue"
import { submit2FaCode } from "../components/FetchFunctions"

export default {
	setup(){

		const inputCode = ref(null)
		const codeAccepted = ref(false)

		const user = computed(() => {
			return useStore().getters.whoAmI;
		})

		async function submitCode() {
			codeAccepted.value = await submit2FaCode(inputCode.value)
		}

		return {user, ref, submit2FaCode, submitCode, inputCode, codeAccepted}
	}
}
</script>

<style>

</style>