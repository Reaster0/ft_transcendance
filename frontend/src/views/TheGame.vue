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
			<div class="button_slick big_button ">FATAL ERROR PLEASE REFRESH</div>
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
			ball: {x: 0, y: 0, radius: 10},
			paddle:{ width: 5, height: 15 },
			paddleL: { x: 0, y: 0 },
			paddleR: { x: 0, y: 0 },
			score: { leftScore: 0, rightScore: 0 },
			winner: "",
		})
		let canvas
		let ctx

		onMounted(async() =>{

			try {
				gameSocket.value = await io('http://82.65.87.54:3000/game',{
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

			gameSocket.value.on('dimensions', params =>{
				console.log("dimensions:")
				gameData.value.ball.radius = params.ballRad
				gameData.value.paddle.height = params.padWidth
				gameData.value.paddle.width = params.padLength
				console.log("ball radius =" + JSON.stringify(gameData.value.ball.radius) + " paddle width =" + JSON.stringify(gameData.value.paddle.width) + " paddle length =" + JSON.stringify(gameData.value.paddle.height))
			})

			gameSocket.value.on('countdown', params =>{
				console.log("countdown:" + params.countdown)
			})

			gameSocket.value.on('gameStarting', () =>{
				console.log("gameStarting:")
				canvas = document.getElementById('pongGame');
				canvas.width = window.innerWidth
				canvas.height = window.innerHeight
				ctx = canvas.getContext('2d');
				gameData.value.gameStarted = true
				console.log("max-width:" + canvas.width + " max-height:" + canvas.height)
			})

	canvas = document.getElementById('pongGame');
			canvas.width = window.innerWidth
				canvas.height = window.innerHeight
				ctx = canvas.getContext('2d');


			gameSocket.value.on('gameUpdate', params =>{
				// console.log(JSON.stringify(params))

				gameData.value.ball.x = params.ball.x
				gameData.value.ball.y = params.ball.y
				gameData.value.paddleL = params.paddle.L
				gameData.value.paddleR = params.paddle.R

				// console.log("ball position x:" +gameData.value.ball.x + " y:" +gameData.value.ball.y + " ball radus:" +
				// gameData.value.ball.radius + " \npaddleL x:" + gameData.value.paddleL.x + " y:" + gameData.value.paddleR.y +
				// " \npaddleR x:" + gameData.value.paddleR.x + " y:" + gameData.value.paddleL.y +
				// "\npaddle width:" + gameData.value.paddle.width + " paddle length:" + gameData.value.paddle.height)
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
			window.setInterval(renderFrame, 1000/60)
			// const frames = 
			// window.clearInterval(frames)
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

		function Disconnect(){
			gameSocket.value.disconnect()
			console.log("disconnect")
		}

		function renderFrame() {
			// console.log("renderFrame")
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.fillStyle = '#fff'
			ctx.fillRect(gameData.value.paddleL.x * canvas.width, gameData.value.paddleL.y * canvas.height, gameData.value.paddle.width * canvas.width, gameData.value.paddle.height * canvas.height)
			ctx.fillRect(gameData.value.paddleR.x * canvas.width, gameData.value.paddleR.y * canvas.height, gameData.value.paddle.width * canvas.width, gameData.value.paddle.height * canvas.height)
			ctx.beginPath();
			ctx.arc(gameData.value.ball.x * canvas.width,gameData.value.ball.y * canvas.height, gameData.value.ball.radius * canvas.height, 0, Math.PI*2, false);
			ctx.closePath();
			ctx.fill();


			// renderFrame()
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