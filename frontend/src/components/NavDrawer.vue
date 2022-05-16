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

		</v-toolbar-title>
			<v-spacer></v-spacer>
			<router-link to="/login">
				<v-btn flat color="grey" align-end="true">
					Login
					<v-icon>mdi-login</v-icon>
				</v-btn>
		</router-link>
	</v-toolbar>
	<v-navigation-drawer v-model="drawer" temporary floating color="#2C3E50" background-color="#2C3E50">
		<!-- put things there -->
	</v-navigation-drawer>
</div>
</template>

<script>

export default {
	data() {
		return {
			drawer: false,
		}
	},
}
</script>

<style>
</style>