<template>
	<v-container>
		<!-- <canva id="c"></canva> -->
		<v-btn @click="sendMessage">send Msg</v-btn>
	</v-container>
</template>

<script>
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"

export default {
	setup(){
		const connection = ref(null)

		onMounted(() =>{
			console.log("starting connection to websocket")
			connection.value = new WebSocket("://localhost:3000/game")

			connection.value.onmessage = (event) => {
				console.log(event)
			}

			connection.value.onopen = (event) => {
				console.log(event)
				console.log("connected to the server")
			}

			connection.value.onclose = (event) => {
				console.log(event)
				console.log("disconnected from the server")
			}
		})

		function sendMessage(message){
			console.log(connection)
			connection.value.send(message)
		}

			return { connection, sendMessage }

	}
}
</script>

<style>

</style>