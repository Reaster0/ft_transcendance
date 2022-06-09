<template>
<v-container>
	<particles-bg type="thick" color="00214A" :bg="true" />
	<v-container v-if="user">
		<v-row>
			<v-col class="text">
				<h3>nickname: {{user.nickname}}</h3>
				<h3>Elo: {{user.eloScore}}</h3>
			</v-col>
				<v-img class="text" :src="avatar"></v-img>
				<v-col cols="2">
				<v-btn height="80" width="180" color="#FF82F4" class="text2" outlined rounded to="/user/edit">Edit</v-btn>
				<h1 class="text2">PROFILE</h1>
			</v-col>
		</v-row>
	</v-container>
	<v-container v-if="user && !user.is2FAEnabled">
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
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import { submit2FaCode, getAvatarID } from "../components/FetchFunctions"
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue

export default {
	components: {
		ParticlesBg
	},
	setup(){

		const inputCode = ref(null)
		const codeAccepted = ref(false)
		const user = ref(null)
		const avatar = ref(null)

		onMounted(async () => {
			user.value = useStore().getters.whoAmI;
			avatar.value = await getAvatarID(user.value.id)
			console.log(avatar.value)
		})


		async function submitCode() {
			codeAccepted.value = await submit2FaCode(inputCode.value)
		}

		return {
		user,
		ref,
		submit2FaCode,
		submitCode,
		inputCode,
		codeAccepted,
		avatar}
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
