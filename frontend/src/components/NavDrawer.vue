<template>
	<v-toolbar flat dense app color="black">
		<v-toolbar-title>
			<router-link to="/" style="text-decoration: none; color: inherit;">
				<span class="text-overline">Transcendance</span>
			</router-link>
		</v-toolbar-title>
			<v-spacer></v-spacer>
				<v-btn to="/chatgroup" flat color="grey" align-end="true">
					Chat
				</v-btn>
				<v-btn v-if="!isLog" to="/login" flat color="grey" align-end="true">
					Login
					<v-icon>mdi-login</v-icon>
				</v-btn>
				<div v-else>
					<v-btn to="/user" flat color="grey" align-end="true">
						Account
						<v-icon>mdi-login</v-icon>
					</v-btn>
					<v-btn color="red" @click="logOut" to="/">Logout</v-btn>
				</div>
	</v-toolbar>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
	setup() {
		const store = useStore()

		const isLog = computed(() => {
			return store.getters.isConnected
		})

		async function logOut(){
			await fetch("/api/users/logout", {credentials: "include", method: "PATCH"})
			.then(store.commit('setConnected', [false, false]))
		}

		return {isLog, logOut}
	}
}
</script>

<style>
</style>