<template>
	<v-container>
		<!-- <canva id="c"></canva> -->
		<v-card class="mx-auto" width="300" color="#ff3300">
		<h1>Searching A Game...</h1>
		</v-card>
		<v-btn v-if="matchId" @click="AcceptGame">joinGame</v-btn>
	</v-container>
</template>

<script>
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
import { useKeypress } from "vue3-keypress";

export default {
	setup(){
		const connection = ref(null)
		const matchId = ref(null)

		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
					connection.value = io('http://82.65.87.54:3000/game',{
					transportOptions: {
					polling: { extraHeaders: { auth: document.cookie} },
					},
				})
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}

			connection.value.on('joined', text => {
				console.log("joined" + text)
			})

			connection.value.on('foundMatch', res =>{
				matchId.value = res
				console.log("found match:" + res)
			})

			connection.value.on('beReady', (position, Id, rivalName) =>{
				console.log("beReady:" + position + rivalName + Id)
			})

			connection.value.onmessage = (event) => {
				console.log("message from server:" + event)
			}

			connection.value.onopen = (event) => {
				console.log(event)
				console.log("connected to the server")
			}

			connection.value.onclose = (event) => {
				console.log(event)
				console.log("disconnected from the server")
			}

			Play();
			})


		function Play(){
			connection.value.emit('joinGame')
			console.log("joinGame")
		}

		function AcceptGame(){
			connection.value.emit('acceptGame', matchId.value)
			console.log("acceptGame")
		}

		const GameInput = ({input}) =>{
			console.log("gameInput" + input)
			if (matchId.value)
				connection.value.emit('gameInput', matchId, input)
		}
			useKeypress({
			keyEvent: "keydown",
			keyBinds: [
				{
					keyCode: 87,
					success: () => {
						connection.value.emit('gameInput', {matchId: matchId.value, input: "UP"})
					},
				},
				{
					keyCode: 83,
					success: () => {
						connection.value.emit('gameInput', {matchId: matchId.value, input: "DOWN"})
					},
				},
			]
			})

			return { connection, Play, AcceptGame, GameInput, matchId }

	}
}
</script>

<style>

</style>