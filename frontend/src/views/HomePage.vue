<template>
	<v-container>
		<particles-bg type="cobweb" :bg="true" />
		<v-img :aspect-ratio="16/9" height="500" src="../assets/42_Logo.svg"/>
		<h1 align="center">This Site is under heavy construction!</h1>
		<v-row>
			<v-col align="center">
			<h1 class="text">Play the</h1>
			<v-btn elevation="24" outlined rounded min-height="100" min-width="200" color="#ff0000" to="/game">
				<h1 class="text">Game</h1>
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue

export default {
	components: {
		ParticlesBg
	},
	setup(){
	}
}
</script>

<style scoped>
.text{
	font-size: 3em;
	font-weight: bold;
	color: white;
}
</style>