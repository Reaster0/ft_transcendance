<template>
<div>
	<div v-if="!gameStarted">
		<v-row justify="center">
				<div class="button_slick Spotnik">W ⬆️</div>
				<div class="button_slick Spotnik">S ⬇️</div>
		</v-row>
		<div v-if="!fatalError">
			<v-container>
				<v-row justify="center">
					<div v-if="!searchingGame" class="button_slick button_slide big_button Spotnik" @click="Play">SearchGame</div>
					<div v-else-if="!matchId" class="button_slick big_button Spotnik">Searching A Game</div>
					<div v-else class="button_slide button_slick big_button Spotnik" @click="AcceptGame">A Game Has Been Found!</div>
				</v-row>
			</v-container>
		</div>
		<v-row v-else justify="center">
			<div class="button_slick big_button Spotnik">FATAL ERROR PLEASE REFRESH</div>
		</v-row>
		<div class="params">
			<div class="button_slick">
				<h1 class="Spotnik">Ball Params</h1>
				<h1>Slow</h1>
				<h1>Mid</h1>
				<h1>Speedy</h1>
			</div>
			<div class="button_slick">
				<h1 class="Spotnik">Paddle Params</h1>
				<h1>Small</h1>
				<h1>Mid</h1>
				<h1>Chonke</h1>
			</div>
		</div>
	</div>
	<div v-show="gameStarted">
		<canvas id="pongGame"></canvas>
	</div>
	<img id="left_arrow" :src="require('../assets/arrow-left.png')" style="display:none"/>
	<img id="right_arrow" :src="require('../assets/arrow-right.png')" style="display:none"/>
</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core"
import { ref, watch } from "vue"
import io from 'socket.io-client';
import { useKeypress } from "vue3-keypress";
import { onBeforeRouteLeave } from 'vue-router';
// import image from "../assets/arrow-left.png"

export default {
	setup(){
		const gameSocket = ref(null)
		const matchId = ref(null)
		const searchingGame = ref(false)
		const fatalError = ref(false)
		const gameData = ref({
			pos: "",
			opponent: "",
			ball: {x: 0, y: 0, radius: 10},
			paddle:{ width: 5, height: 15 },
			paddleL: { x: 0, y: 0 },
			paddleR: { x: 0, y: 0 },
			score: { leftScore: 0, rightScore: 0 },
			winner: "",
		})
		const gameStarted = ref(false)
		let canvas = null
		let ctx = null
		let framesId = null
		let winText = null
		let showInfo = true

		onMounted(async() =>{

			try {
				gameSocket.value = io('http://82.65.87.54:3000/game',{
				// gameSocket.value = io('http://localhost:3000/game',{
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
				console.log("found match:" + JSON.stringify(res))
				if (!res)
					gameStarted.value = false
			})

			gameSocket.value.on('beReady', params =>{
				console.log("beReady:")
				gameData.value.pos = params.pos
				gameData.value.opponent = params.opponent

				canvas = document.getElementById('pongGame');
				canvas.width = window.innerWidth
				canvas.height = window.innerHeight
				ctx = canvas.getContext('2d');
				gameStarted.value = true
				console.log("max-width:" + canvas.width + " max-height:" + canvas.height)
			})

			gameSocket.value.on('dimensions', params =>{
				console.log("dimensions:")
				gameData.value.ball.radius = params.ballRad
				gameData.value.paddle.height = params.padWidth
				gameData.value.paddle.width = params.padLength
			})

			gameSocket.value.on('countdown', params =>{
				console.log("countdown:" + params.countdown)
			})

			gameSocket.value.on('gameStarting', () =>{
				console.log("gameStarting:")
				showInfo = false
			})

			gameSocket.value.on('gameUpdate', params =>{

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
				gameData.value.score = params
			})

			gameSocket.value.on('endGame', params =>{
				console.log("endGame:" + JSON.stringify(params))
				gameData.value.winner = params.winner
				if (params.winner != gameData.value.opponent)
					winText = "well done neo keep dreaming"
				else
					winText = "wake up neo stop loosing"
			})

			gameSocket.value.on('requestError', () =>{
				console.log("requestError")
			})

			gameSocket.value.onopen = (event) => {
				console.log(event)
				console.log("connected to the server")
			}

			gameSocket.value.onclose = (event) => {
				console.log(event)
				fatalError.value = true
			}
			})

		watch(gameStarted, (gameChange) =>{
			if (gameChange)
			{
				if (!canvas)
				{
					canvas = document.getElementById('pongGame');
					canvas.width = window.innerWidth
					canvas.height = window.innerHeight
					ctx = canvas.getContext('2d');
				}
				framesId = window.setInterval(renderFrame, 16)
			}
			else
				window.clearInterval(framesId)
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
			//send in the request the params game
			gameSocket.value.emit('joinGame')
			searchingGame.value = true
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
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.fillStyle = '#00ff00'
			ctx.fillRect(gameData.value.paddleL.x * canvas.width, gameData.value.paddleL.y * canvas.height, gameData.value.paddle.width * canvas.width, gameData.value.paddle.height * canvas.height)
			ctx.fillRect(gameData.value.paddleR.x * canvas.width, gameData.value.paddleR.y * canvas.height, gameData.value.paddle.width * canvas.width, gameData.value.paddle.height * canvas.height)
			ctx.beginPath()
			ctx.arc(gameData.value.ball.x * canvas.width,gameData.value.ball.y * canvas.height, gameData.value.ball.radius * canvas.height, 0, Math.PI*2, false)
			ctx.closePath()
			ctx.fill()
			ctx.font = canvas.width/3 + "%" + " Monospace"
			ctx.fillText(gameData.value.score.leftScore, 0.4 * canvas.width, 0.1 * canvas.height);
			ctx.fillText(gameData.value.score.rightScore, 0.6 * canvas.width, 0.1 * canvas.height);

			if (winText)
			{
				winText = "wake up neo stop loosing"
				ctx.font = canvas.width/4 + "%" + " Spotnik"
				ctx.fillText(winText, 0.2 * canvas.width, 0.5 * canvas.height);
			}
			if (showInfo){
				if (gameData.value.pos == "left")
					ctx.drawImage(document.getElementById('left_arrow') , 0.2 * canvas.width, 0.35 * canvas.height, 0.15 * canvas.width, 0.25 * canvas.height)
				else
					ctx.drawImage(document.getElementById('right_arrow') , 0.6 * canvas.width, 0.35 * canvas.height, 0.15 * canvas.width, 0.25 * canvas.height)
				ctx.font = canvas.width/4 + "%" + " Spotnik"
				ctx.fillText("VS " + gameData.value.opponent, 0.35 * canvas.width, 0.9 * canvas.height);
			}
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

		return { Disconnect, Play, AcceptGame, matchId, fatalError, gameData, gameStarted, searchingGame}
	},
}
</script>

<style>

h1 {
	justify: end;
}

.params{
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}


.button_slick {
  color: #FFF;
  border: 2px solid rgb(216, 2, 134);
  background-color: #162944;
  border-radius: 0px;
  padding: 18px 36px;
  display: inline-block;
  /* font-family: monospace; */
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
