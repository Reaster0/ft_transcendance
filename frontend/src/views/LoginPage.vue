<template>
<v-col align="center">
	<div class="field_slick">
		<div v-if="need2fa">
			<v-text-field @keydown.enter="submitCode" v-model="inputCode" label="Input 2FA Code" color="white" maxlength="6"></v-text-field>
			<h1 class="Spotnik">Enter Two Factor Code</h1>
		</div>
		<div v-else>
			<h1 class="Spotnik">Click To Connect</h1>
			<v-btn loading rounded elevation="5" outlined min-width="50%" height="20%" @click="gotToAuth">
				<img width="100" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42 Logo"/>
			</v-btn>
		</div>
	</div>
</v-col>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { submit2FaCode } from "../components/FetchFunctions"
import { useRouter } from "vue-router";

export default defineComponent ({
	setup()
	{
		const router = useRouter();
		const inputCode = ref<string | null>(null);
		const store = useStore();

		const need2fa = computed(() => {
			return store.getters.need2Fa;
		})
		
		function gotToAuth()
		{
			document.location = process.env.VUE_APP_BACKEND + "/auth/login-42"
		}

		async function submitCode() {
			if(await submit2FaCode(inputCode.value as string))			{
				store.commit('setNeed2FA', false)
				// store.commit('setUser', await getUserInfo())
				router.push('/user')
			}
		}

		return {need2fa, inputCode, submitCode, gotToAuth}
	},
})
</script>

<style scoped>
.big_text{
	font-size: 3em;
	font-weight: bold;
}

.field_slick {
  color: #FFF;
  max-width: 50%;
  border: 2px solid rgb(216, 2, 134);
  background-color: #162944;
  border-radius: 0px;
  padding: 18px 36px;
  margin: 30px auto 0 auto;
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: inset 0 0 0 0 #D80286;
  -webkit-transition: ease-out 0.4s;
  -moz-transition: ease-out 0.4s;
  transition: ease-out 0.4s;
}
</style>
