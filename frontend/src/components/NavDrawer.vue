<template>
<div>
	<v-toolbar flat dense app color="black">
		<v-toolbar-title>
			<v-btn icon @click="drawer = !drawer">
				<v-icon>mdi-format-list-bulleted-square</v-icon>
			</v-btn>

			<router-link to="/" style="text-decoration: none; color: inherit;">
				<span class="text-overline">Transcendance</span>
			</router-link>
		<v-btn>Chat</v-btn>

		</v-toolbar-title>
			<v-spacer></v-spacer>
				<v-btn v-if="!isLog" to="/login" flat color="grey" align-end="true">
					Login
					<v-icon>mdi-login</v-icon>
				</v-btn>
				<div v-else>
					<v-btn to="/user" flat color="grey" align-end="true">
						Account
						<v-icon>mdi-login</v-icon>
					</v-btn>
					<v-btn color="red" href="/api/users/logout">Logout</v-btn>
				</div>
	</v-toolbar>
	<v-navigation-drawer v-model="drawer" temporary floating color="#2C3E50" background-color="#2C3E50">
		<!-- put things there -->
		<v-card>nothing to see here</v-card>
	</v-navigation-drawer>
</div>
</template>

<script>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core'
import { isLogged } from "../components/FetchFunctions.js"

export default {
	data() {
		return {
			drawer: false,
		}
	},
	setup() {
		const isLog = ref(null)

		onMounted(async() => {
			isLog.value = await isLogged()
		})

		return {isLog}
	}
}
</script>

<style>
</style>