<template>
<v-container v-if="user">
	<particles-bg type="cobweb" :bg="true"/>
	<div class="center">
		<div class="overlay">
			<v-col align="center">
				<h1>{{user.nickname}}</h1>
				<h1>{{user.eloScore}}📈</h1>
			</v-col>
		</div>

	</div>
</v-container>
</template>

<script>
import { useStore } from "vuex"
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import { getAvatarID } from "../components/FetchFunctions"
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue

export default {
	components: {
		ParticlesBg
	},
	setup(){
		// const inputCode = ref(null)
		// const codeAccepted = ref(false)
		const user = ref(null)
		const avatar = ref(null)
		const test = "haha"

		onMounted(async () => {
			user.value = await useStore().getters.whoAmI;
			avatar.value = await getAvatarID(user.value.id)
			console.log(avatar.value)
		})


		// async function submitCode() {
		// 	codeAccepted.value = await submit2FaCode(inputCode.value)
		// }
		return {user, avatar, test}
	}
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Rajdhani:300&display=swap');

h1{
	justify-self: center;
	font-size: 4em;
 font-weight: bold;
 font-family: 'Rajdhani', sans-serif;
	color: #04BBEC;
	// margin-left: 20%;
}

.center{
	display: flex;
	justify-content: center;
	margin-top: 2em;
	height: 100%;
}

.overlay {
  width: 65%;
  padding-bottom: 20%;
  margin: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(#00214A, 0.8);
  border-radius: 3rem;
  box-shadow: 0 0 0 8px rgba(#FF82F4, 0.2);
  filter:  drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.50));
}

</style>