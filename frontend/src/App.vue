<template>
	<v-app>
		<NavDrawer/>
		<v-parallax min-height="1000" src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">
		<router-view/>
		</v-parallax>
	</v-app>
</template>

<script>
import NavDrawer from "./components/NavDrawer.vue"
import { useStore } from "vuex"
import { onMounted } from "@vue/runtime-core"
import { isLogged, getUserInfo } from "./components/FetchFunctions.js"

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
		const store = useStore()

		onMounted(async() => {
			store.commit('setConnected' ,await isLogged())
			if (store.getters.isConnected) {
				store.commit('setUser', await getUserInfo())
			}
	})
  }
}
</script>

<style>
</style>
