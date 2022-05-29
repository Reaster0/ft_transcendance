<template>
	<v-container>
		<!-- <canva id="c"></canva> -->
		<v-card class="mx-auto" width="300" color="#ff3300">
		<h1>Searching A Game...</h1>
		</v-card>
		<v-btn v-if="matchId" @click="AcceptGame">joinGame</v-btn>
	</v-container>
</template>

<!-- Aimé Julien 42, [29 May 2022 at 12:50:30]:
================= subscribe message =====
for creating a new channel/room: 
- createChannel { chanName: string, password:string, publicChannel: boolean }

for deleting channel/room:
- deleteChannel { id: string }

for sending message:
-  message {content: string, channel: Chan, ...}

for joinning a existing channel
- joinChannel { id: string }

(or just put a channel in argument

for leaving channel:
- leaveChannel { channel or id: string}

for bloking or unblocking  a user:
- blockUser{ user: User, block: boolean } // true => block false => unblock

============= info you can retrive ======

- channel : get all the chanel the user is connected

- connectedUsers : get all user.id of user connected..... (but the function feels wrong....) -->

<script>
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
import { useKeypress } from "vue3-keypress";

export default {
    chanName = false, 
    password = false, 
    publicChannel = false,
	setup(){
		const connection = ref(null)
		const matchId = ref(null)

		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
					connection.value = io('http://82.65.87.54:3000/chat',{
					transportOptions: {
					polling: { extraHeaders: { auth: document.cookie} },
					},
				})
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}

			// connection.value.on('joined', text => {
			// 	console.log("joined" + text)
			// })

			// connection.value.on('foundMatch', res =>{
			// 	matchId.value = res
			// 	console.log("found match:" + res)
			// })

			// connection.value.on('beReady', (position, Id, rivalName) =>{
			// 	console.log("beReady:" + position + rivalName + Id)
			// })

			// connection.value.onmessage = (event) => {
			// 	console.log("message from server:" + event)
			// }

			// connection.value.onopen = (event) => {
			// 	console.log(event)
			// 	console.log("connected to the server")
			// }

			// connection.value.onclose = (event) => {
			// 	console.log(event)
			// 	console.log("disconnected from the server")
			// }

			// Play();
			})

        // берет аргс и создает новый канал
        // { chanName: string, password:string, publicChannel: boolean }
		function NewChannel(chanName, password, publicChannel){
			connection.value.emit('createChannel', chanName, password, publicChannel)
			console.log("createChannel")
		}


		const GameInput = ({input}) =>{
			console.log("sendMessage" + input)
		}
			useKeypress({
			keyEvent: "keydown",
			keyBinds: 
				{
					keyCode: 13,
					success: () => {
                        connection.value.emit('sendMessage', {input: "Enter"})
					},
				},
			})
			return {connection, NewChannel}

	}
}
</script>

<style>

</style>