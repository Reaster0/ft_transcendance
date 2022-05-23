<template>
<v-container>
	<particles-bg type="thick" color="00214A" :bg="true" />
	<v-container v-if="user" >
		<v-row>
			<v-col align="center" class="text">
				<h3>User ID: {{user.id}}</h3>
				<h3>nickname: {{user.nickname}}</h3>
				<h3>username: {{user.username}}</h3>
				<h3>email: {{user.email}}</h3>
				<h3>Elo: {{user.eloScore}}</h3>
				<h3>Connected: {{user.status}}</h3>
				<h3>is2FAEnabled: {{user.is2FAEnabled}}</h3>
			</v-col>
		</v-row>
	</v-container>
	<v-container v-if="!user.is2FAEnabled">
		<v-row justify="center" align-content="space-around">
			<v-btn height="150" width="150" elevation="2" icon outlined to="/2auth" user="user">
				<v-img src="../assets/qr-code-logo.png"/>
			</v-btn>
		</v-row>
		<v-row justify="center">
			<h1 class="text2">Enable 2FA</h1>
		</v-row>
	</v-container>
</v-container>
</template>

<script>
import { useStore } from "vuex"
import { computed } from "@vue/runtime-core"
import { ref } from "vue"
import { submit2FaCode } from "../components/FetchFunctions"
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue


export default {
	components: {
		ParticlesBg
	},
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

<style scoped>
.text{
	font-size: 2em;
	/* font-weight: bold; */
	color: #EA25B5;
}
.text2{
	font-size: 3em;
	font-weight: bold;
	color: #04BBEC;
}
</style>