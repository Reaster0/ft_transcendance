<template>
	<v-app>
		<NavDrawer/>
		<v-parallax min-height="1000" src="./assets/blurredy.jpg">
		<router-view/>
		</v-parallax>
	</v-app>
</template>

<script>
import NavDrawer from "./components/NavDrawer.vue"

export default {
	name: 'App',
	components: {
		NavDrawer,
	},
	methods: {
	redirect(){
		this.$router.push({ name: 'Home'});
	},
	back(){
		this.$router.go(-1);
	},
	forward(){
		this.$router.go(1);
	},
  },

  setup(){
	}
}
</script>

<style>
</style>
