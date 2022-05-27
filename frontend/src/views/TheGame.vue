<template>
<div>
	<div v-if="!fatalError">
		<v-container>
			<!-- <canva id="c"></canva> -->

			<v-row justify="center">
				<div v-if="!matchId" class="button_slick">Searching A Game...</div>
				<div v-else class="button_slide button_slick" @click="AcceptGame">a game has been found!</div>
			</v-row>	
		</v-container>
	</div>
	<v-row v-else justify="center">
		<div class="button_slick">FATAL ERROR PLEASE REFRESH</div>
	</v-row>
</div>
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
		const fatalError = ref(false)
		const gameData = ref({})

		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
					connection.value = io('http://82.65.87.54:3000/game',{
					transportOptions: {
					polling: { extraHeaders: { auth: document.cookie} },
					},
				})
				console.log(connection.value)
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

			connection.value.on('beReady', (params, lol, mdr) =>{
				console.log("beReady:" + params)
				gameData.value = params
				console.log(gameData.value+lol+ mdr)
			})

			connection.value.on('requestError', () =>{
				console.log("requestError")
				fatalError.value = true
			})

			connection.value.onopen = (event) => {
				console.log(event)
				console.log("connected to the server")
			}

			connection.value.onclose = (event) => {
				console.log(event)
				fatalError.value = true
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

		return { connection, Play, AcceptGame, GameInput, matchId, fatalError }
	},
}
</script>

<style>

.button_slick {
  color: #FFF;
  border: 2px solid rgb(216, 2, 134);
  background-color: #162944;
  border-radius: 0px;
  padding: 18px 36px;
  display: inline-block;
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: inset 0 0 0 0 #D80286;
  -webkit-transition: ease-out 0.4s;
  -moz-transition: ease-out 0.4s;
  transition: ease-out 0.4s;
  margin: 150px auto 0 auto;
}

.button_slide:hover {
	cursor: pointer;
	box-shadow: inset 0 100px 0 0 #D80286;
}

</style>