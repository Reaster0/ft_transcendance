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
					<div class="field_slick">
					<v-text-field @keydown.enter="submitCode" v-model="TwoFACode" label="2FA Code" color="white" counter="6" maxlength="6" max-width="100"></v-text-field>
					</div>
					<v-img :src="imgQR" max-height="400"></v-img>
				</v-col>
			</v-row>
		</div>
	</div>
	</v-container>
</template>

<script lang="ts">
import { useStore } from "vuex"
import { computed } from "@vue/runtime-core"
import { ref, defineComponent } from "vue"
import { getInitialQR, submit2FaCode } from "../components/FetchFunctions"
import router from "../router/index";

export default defineComponent ({
	setup(){

		const imgQR = ref<null | any>(null);
		const TwoFACode = ref<null | string>(null);
		const codeAccepted = ref<boolean>(false);

		const user = computed(() => {
			return useStore().getters.whoAmI;
		})

		async function submitCode() {
			codeAccepted.value = await submit2FaCode(TwoFACode!.value as string)
			if (codeAccepted.value){
				router.push({path: '/user'})
			}
		}

		return {user, imgQR, getInitialQR, TwoFACode, codeAccepted, submit2FaCode, submitCode}
	},
})
</script>

<style scoped>
.text{
	font-size: 3em;
	font-weight: bold;
	color: white;
}

.field_slick {
  color: #FFF;
  border: 2px solid rgb(216, 2, 134);
  background-color: #162944;
  border-radius: 0px;
  padding: 18px 36px;
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: inset 0 0 0 0 #D80286;
  -webkit-transition: ease-out 0.4s;
  -moz-transition: ease-out 0.4s;
  transition: ease-out 0.4s;
}
</style>
