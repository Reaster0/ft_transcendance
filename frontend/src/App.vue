<template>
	<v-app>
		<NavDrawer/>
		<router-view/>
	</v-app>
</template>

<script>
import NavDrawer from "./components/NavDrawer.vue"

export default {
	name: 'App',
	components: {
		NavDrawer
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
  }
}
</script>

<style>
</style>
