<template>
	<v-container v-if="need2fa">
		<v-col md="4" offset-md="4">
			<v-text-field @keydown.enter="submitCode" v-model="inputCode" label="Input 2FA Code" color="white" counter="6" maxlength="6"></v-text-field>
			<h1 class="text">need to enter 2fa code</h1>
		</v-col>
	</v-container>
	<div v-else-if="!isLog">
		<v-container>
			<v-row justify="center">
				<v-btn loading rounded elevation="5" outlined width="500" height="500" href="/api/auth/login-42">
					<img width="100" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42 Logo"/>
					AUTH
				</v-btn>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { submit2FaCode, getUserInfo } from "../components/FetchFunctions"
import { useRouter } from "vue-router";

export default {
	setup()
	{
		const router = useRouter()
		const inputCode = ref(null)
		const store = useStore()
		const isLog = computed(() => {
			return store.getters.isConnected;
		})
		const need2fa = computed(() => {
			return store.getters.need2Fa;
		})

		async function submitCode() {
			if(await submit2FaCode(inputCode.value))
			{
				store.commit('setNeed2FA', false)
				store.commit('setUser', await getUserInfo())
				router.push('/user')
			}
		}

		return {isLog, need2fa, inputCode, submitCode}
	},
}
</script>

<style scoped>
.text{
	font-size: 3em;
	font-weight: bold;
	color: #04BBEC;
}
</style>