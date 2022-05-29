<template>
<div>
	<v-row justify="center">
			<div class="button_slick button_slide" @click="TestTest">
				caca
			</div>
	</v-row>
</div>
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
//import { useKeypress } from "vue3-keypress";

export default {
    chanName : '', 
    password : false, 
    publicChannel : false,
	setup()
    {
		const connection = ref(null)
		//const matchId = ref(null)

		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
					connection.value = io('http://172.20.10.10:3000/chat',{
					transportOptions: {
					polling: { extraHeaders: { auth: document.cookie} },
					},
				})
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}

            // : connection.value.on(‘command’, (received) => {})
            connection.value.on('channel', (channels) => 
            {console.log("channel:" + channels)})

//			NewChannel();
            TestTest();
			})

        // берет аргс и создает новый канал
        //i { chanName: string, password:string, publicChannel: boolean }
		//function NewChannel(chanName, password, publicChannel){
		//	console.log("befor createChannel");
		//	connection.value.emit('createChannel', chanName, password, publicChannel);
		//	console.log("createChannel");
		//}

        function TestTest(){
			console.log("befor createChannel");
			connection.value.emit('createChannel');
			console.log("after createChannel")
		}

        // useKeypress({
		// keyEvent: "keydown",
		// keyBinds:
		// 	{
		// 		keyCode: 13,
		// 		success: () => {
		// 			gameSocket.value.emit('sendMessage', {matchId: matchId.value, input: "Enter"})
		// 		},
		// 	},
		// })

		return {TestTest}

	}
}
</script>

<style>

</style>