<template>
	<v-container>
	<div v-if="!codeAccepted">
		<v-row v-if="!imgQR">
			<v-col align="center">
				<h1 class="text">Get your</h1>
				<v-btn plain rounded elevation="1" @click="async () => {imgQR = await getInitialQR()}">Very own QR Code</v-btn>
			</v-col>
		</v-row>
		<div v-if="imgQR">
			<v-row justify="center">
				<v-col cols="6">
					<v-text-field @keydown.enter="submitCode" v-model="TwoFACode" label="2FA Code" color="white"></v-text-field>
					<v-img :src="imgQR" max-height="600"></v-img>
				</v-col>
			</v-row>
		</div>
	</div>
	<h1 class="text" v-else>Code Accepted!</h1>
	</v-container>
</template>

<script>
import { useStore } from "vuex"
import { computed } from "@vue/runtime-core"
import { ref } from "vue"
import { getInitialQR, submit2FaCode } from "../components/FetchFunctions"

export default {
	setup(){

		const imgQR = ref(null)
		const TwoFACode = ref(null)
		const codeAccepted = ref(false)

		const user = computed(() => {
			return useStore().getters.whoAmI;
		})

		async function submitCode() {
			codeAccepted.value = await submit2FaCode(TwoFACode.value)
		}

		return {user, imgQR, getInitialQR, TwoFACode, codeAccepted, submit2FaCode, submitCode}
	},
}
</script>

<style scoped>
.text{
	font-size: 3em;
	font-weight: bold;
	color: white;
}
</style>