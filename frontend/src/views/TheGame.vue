<template>
<div>
	<div v-if="!gameData.gameStarted">
		<v-row justify="center">
				<div class="button_slick button_slide" @click="Play">
					SearchGame
				</div>
		</v-row>
		<div v-if="!fatalError">
			<v-container>
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
	<div v-show="gameData.gameStarted">
		<canvas id="pongGame" style="background-color: black;"></canvas>
	</div>
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
		const gameData = ref({
			gameStarted: false,
			pos: "",
			opponent: "",
			ball: { pos: { x: 30, y: 50 }, radius: 10},
			paddle:{L: { blcPos: { x: 15, y: 25 }, width: 5, length: 15 },
					R: { blcPos: { x: 280, y: 100 }, width: 5, length: 15 },
			},
			score: { leftScore: 0, rightScore: 0 },
			winner: "",
		})

		onMounted(async() =>{


			const canvas = document.getElementById('pongGame');
			const ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
			console.log("max-width:" + canvas.width + " max-height:" + canvas.height)
			// canvas.width = window.innerWidth
			// canvas.height = window.innerHeight
			// console.log("max-width:" + canvas.width + " max-height:" + canvas.height)
			// ctx.fillStyle = '#fff'
			// ctx.fillRect(gameData.value.L.blcPos.x, gameData.value.L.blcPos.y, gameData.value.L.width, gameData.value.L.height)
			// ctx.fillRect(gameData.value.R.blcPos.x, gameData.value.R.blcPos.y, gameData.value.R.width, gameData.value.R.height)
			// ctx.beginPath();
			// ctx.arc(gameData.value.ball.pos.x, gameData.value.ball.pos.y, gameData.value.ball.radius, 0, Math.PI*2, false);
			// ctx.closePath();
			// ctx.fill();

			try {
				gameSocket.value = io('http://82.65.87.54:3000/game',{
				//gameSocket.value = io('http://localhost:3000/game',{
				transportOptions: {
				polling: { extraHeaders: { auth: document.cookie} },
				}})
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

			gameSocket.value.on('beReady', params =>{
				console.log("beReady:")
				gameData.value.pos = params.pos
				gameData.value.opponent = params.opponent
				gameData.value.gameStarted = true
			})

			gameSocket.value.on('countdown', params =>{
				console.log("countdown:" + params.countdown)
			})

			gameSocket.value.on('gameStarting', () =>{
				console.log("gameStarting:")
			})

			gameSocket.value.on('gameUpdate', params =>{
				console.log(JSON.stringify(params))
				gameData.value.ball = params.ball
				gameData.value.paddle.L = params.paddle.L
				gameData.value.paddle.R = params.paddle.R	
				console.log("ball position x:" + gameData.value.ball.x + " y:" + gameData.value.ball.y 
					+ " \npaddleL x:" + gameData.value.paddle.L.x + " y:" + gameData.value.paddle.L.y +
				" \npaddleR x:" + gameData.value.paddle.R.x + " y:" + gameData.value.paddle.R.y)

				ctx.fillStyle = '#fff'
				ctx.fillRect(gameData.value.paddle.L.x * canvas.width, gameData.value.paddle.L.y * canvas.height, gameData.value.paddle.L.width * canvas.width, gameData.value.paddle.L.length * canvas.height)
				ctx.fillRect(gameData.value.paddle.R.x * canvas.width, gameData.value.paddle.R.y * canvas.height, gameData.value.paddle.R.width * canvas.width, gameData.value.paddle.R.length * canvas.height)
				ctx.beginPath();
				ctx.arc(gameData.value.ball.pos.x * canvas.width, gameData.value.ball.pos.y * canvas.height, gameData.value.ball.radius, 0, Math.PI*2, false);
				ctx.closePath();
				ctx.fill();
			})

			gameSocket.value.on('score', params =>{
				console.log("score")
				gameData.value.score = params.score
			})

			gameSocket.value.on('endGame', params =>{
				console.log("endGame")
				gameData.value.winner = params.winner
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
			//Play();

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

		return { Disconnect, Play, AcceptGame, matchId, fatalError, gameData}
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
