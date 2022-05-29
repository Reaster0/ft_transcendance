<template>
<div>
	<v-row justify="center">
			<div class="button_slick button_slide" @click="Play">
				SearchGame
			</div>
	</v-row>
	<div v-if="!fatalError">
		<v-container>
			<!-- <canva id="c"></canva> -->

			<v-row justify="center">
				<div v-if="!matchId" class="button_slick big_button">Searching A Game...(but press the btn)</div>
				<div v-else class="button_slide button_slick big_button" @click="AcceptGame">a game has been found!</div>
			</v-row>
		</v-container>
	</div>
	<v-row v-else justify="center">
		<div class="button_slick big_button">FATAL ERROR PLEASE REFRESH</div>
	</v-row>
</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
import { useKeypress } from "vue3-keypress";
import { onBeforeRouteLeave } from 'vue-router';
export default {
	setup(){
		const gameSocket = ref(null)
		const matchId = ref(null)
		const fatalError = ref(false)
		const gameData = ref({})
		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
				gameSocket.value = io('http://localhost:3000/game',{
				transportOptions: {
				polling: { extraHeaders: { auth: document.cookie} },
				}})
				console.log(gameSocket.value)
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}
			gameSocket.value.on('joined', text => {
				console.log("joined" + text)
			})
			gameSocket.value.on('foundMatch', res =>{
				matchId.value = res
				console.log("found match:" + res)
			})
			gameSocket.value.on('beReady', (params, lol, mdr) =>{
				console.log("beReady:" + params)
				gameData.value = params
				console.log(gameData.value+lol+ mdr)
			})
			gameSocket.value.on('requestError', () =>{
				console.log("requestError")
				// fatalError.value = true
			})
			gameSocket.value.onopen = (event) => {
				console.log(event)
				console.log("connected to the server")
			}
			gameSocket.value.onclose = (event) => {
				console.log(event)
				fatalError.value = true
			}
			// Play();
			})
		onBeforeRouteLeave(() => {
			const answer = window.confirm("Are you sure you want to leave the game?")
			if (answer){
				gameSocket.value.disconnect()
				return true
			}
			return false
		})
		function Play(){
			gameSocket.value.emit('joinGame')
			console.log("joinGame")
		}
		function AcceptGame(){
			gameSocket.value.emit('acceptGame', matchId.value)
			console.log("acceptGame")
		}
		const GameInput = ({input}) =>{
			console.log("gameInput" + input)
			if (matchId.value)
				gameSocket.value.emit('gameInput', matchId, input)
		}
		const Disconnect = () =>{
			gameSocket.value.disconnect()
			console.log("disconnect")
		}
		useKeypress({
		keyEvent: "keydown",
		keyBinds: [
			{
				keyCode: 87,
				success: () => {
					gameSocket.value.emit('gameInput', {matchId: matchId.value, input: "UP"})
				},
			},
			{
				keyCode: 83,
				success: () => {
					gameSocket.value.emit('gameInput', {matchId: matchId.value, input: "DOWN"})
				},
			},
		]
		})
		return { Disconnect, Play, AcceptGame, GameInput, matchId, fatalError }
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
}
.button_slide:hover {
	cursor: pointer;
	box-shadow: inset 0 100px 0 0 #D80286;
}
</style>

<style scoped>
.big_button {  
  margin: 180px auto 0 auto;
}
</style>