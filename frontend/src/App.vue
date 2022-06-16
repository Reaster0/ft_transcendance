<template>
	<v-app>
		<NavDrawer/>
		<v-parallax height="calc(100vh - 56px)" src="./assets/blurredy.jpg">
		<router-view/>
		</v-parallax>
	</v-app>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import NavDrawer from "./components/NavDrawer.vue";

export default defineComponent ({
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
});
</script>

<style>
</style>
