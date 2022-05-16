<template>
  <div>
	<v-container>
		<v-row>
			<v-btn loading rounded elevation="5" outlined width="160" height="100" href="/api/login">
				<img width="100" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" alt="42 Logo"/>
				AUTH
			</v-btn>
		</v-row>
		<v-layout row>
			<!-- <v-flex></v-flex> -->
		</v-layout>
		<div v-if="isLog">
		<v-btn>test</v-btn>
		</div>
	</v-container>
	<p>{{ isLog }}</p>

	</div>
</template>

<script>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core';
import { isLogged } from '../components/FetchFunctions.js'

export default {
	setup()
	{
		const isLog = ref(false)

		onMounted(async() => {
			isLog.value = await isLogged()
		})

		return {isLog}
	},
}
</script>

<style>
</style>