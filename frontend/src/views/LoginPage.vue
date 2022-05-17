<template>
  <div v-if="!isLog">
	<v-container>
		<v-row justify="center">
			<v-btn loading rounded elevation="5" outlined width="500" height="500" href="/api/auth/login-42">
				<img width="100" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42 Logo"/>
				AUTH
			</v-btn>
		</v-row>
	</v-container>
	</div>
	<div v-else>
		<h1 align="center">YOU SHOULDNT BE HERE</h1>
	</div>
</template>

<script>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core';
import { isLogged } from '../components/FetchFunctions.js'

export default {
	setup()
	{
		const isLog = ref(null)

		onMounted(async() => {
			isLog.value = await isLogged()
		})

		return {isLog}
	},
}
</script>

<style>
</style>