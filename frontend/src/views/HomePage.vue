<template>
	<v-container>
		<particles-bg type="cobweb" :bg="true" />
		<v-img :aspect-ratio="16/9" height="500" src="../assets/42_Logo.svg"/>
		<h1 align="center">This Site is under heavy construction!</h1>
		<v-row>
			<v-col align="center">
			<h1 class="text">Play the</h1>
			<v-btn elevation="24" outlined rounded min-height="100" min-width="200" color="rgb(255, 0, 0)" to="/game">
				<h1 class="text rainbow">Game</h1>
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue
import { useStore } from "vuex"
import { onMounted } from "@vue/runtime-core"
import { isLogged } from "../components/FetchFunctions.js"

export default {
	components: {
		ParticlesBg
	},
	setup(){

		onMounted(async() => {
		useStore().commit('setConnected' , await isLogged())
		})
	}
}
</script>

<style scoped>
.text{
	font-size: 4em;
	font-weight: bold;
	color: white;
	cursor: pointer;
	transition: text-shadow 1s;
}

.rainbow:hover {
text-shadow: 0.04em 0.04em #fc0049,
        0.08em 0.08em #fe8f01,
        0.12em 0.12em #fdf21f,
        0.16em 0.16em #3fdf4b,
        0.2em 0.2em #3462fe;
}
</style>