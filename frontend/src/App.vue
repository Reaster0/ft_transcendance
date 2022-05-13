<template>
	<Header/>
	<router-view/>
</template>

<script>
import Header from "./components/HeaderOfPage.vue";

export default {
	name: 'App',
	components: {
		Header
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}
</style>
