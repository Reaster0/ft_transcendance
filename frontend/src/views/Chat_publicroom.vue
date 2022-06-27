<template>
  <v-app >
    <v-container fluid>
      <div v-if="!created">
        <v-form @submit.prevent="submitIt(name)">

          <v-toolbar dark color="rgb(0,0,255)">
            <v-btn to="/newroom" icon dark>
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title >
              <div :style="{color: ' #ffffff'}">
                New chat room settings
              </div>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn :style="{color: ' #ffffff'}" to="/chatgroup">
              Return to chat
            </v-btn>
          </v-toolbar>

          <v-divider></v-divider>
          
          <div class="offsettitle">
            <p class="font-weight-black">
              Public chat 
            </p>
            <p>
              Visible and accessible for anyone
            </p>
          </div>

          <v-col cols="12" sm="6">
            <input type="file" @change="previewFiles">
          </v-col>
          <v-col cols="12" sm="6">
              <v-text-field class="spacetoponly" clearable
                label="Name of the room" placeholder="name" v-model="name">
              </v-text-field>
            <button class="button">SUBMIT</button>
          </v-col>

        </v-form>
      </div>

      <div v-else>
        <h2 class="textabovecenter">
          Public channel {{ name }} was successfully created
        </h2>
        <v-btn class="buttoncenter" to="/thechat">Return to chat</v-btn>
      </div>

    </v-container>
  </v-app>
</template>


<script lang="ts">

import { onMounted, onUnmounted } from "@vue/runtime-core";
import { defineComponent, reactive, ref } from "vue";
import { useStore, Store } from "vuex";
import { onBeforeRouteLeave } from "vue-router";
import { ChannelType } from '../types/chat.types';
import router from "../router/index";
import { leaveChat, verifyChannelName, imgToBuffer } from '../helper';
import io from 'socket.io-client';

export default defineComponent({
  name: "NewRoomPublic",
  setup() {
    const store = reactive(useStore() as Store<any>);
    let chatSocket = store.getters.getChatSocket;
    let name = ref<string>('');
    let file = ref<any>(null);
    let created = ref<boolean>(false);
    let forceLeave = false;

    onBeforeRouteLeave( function(to: any, from: any, next: any) {
      chatSocket.removeAllListeners('disconnect');
      void from;
      const socket = store.getters.getChatSocket;
      leaveChat(forceLeave, socket, to, next, store);
    })

    onMounted(() => {
      try {
        console.log(chatSocket);
        if (!chatSocket) {
          console.log('new connection !');
          const connection = io('ws://:3000/chat',{
            transportOptions: {
              polling: { extraHeaders: { auth: document.cookie} },
            },
          })
          store.commit('setChatSocket' , connection);
          console.log("starting connection to websocket");
          chatSocket = store.getters.getChatSocket;
        }
      } catch (error) {
        console.log("the error is:" + error)
      }

      chatSocket.on('disconnect', function() {
        forceLeave = true;
        alert('Something went wrong. You\'ve been disconnected from chat.');
        router.push('/');
      })

      chatSocket.on("channelCreated", function(channel: string) {
        if (channel === name.value) {
          created.value = true;
        }
      })

      chatSocket.on("errorChannelCreation", function(reason: string) {
        alert("Channel creation failed: " + reason);
      })
    })

    onUnmounted(async() => {
      chatSocket.removeAllListeners('disconnect');
      chatSocket.removeAllListeners('channelCreated');
      chatSocket.removeAllListeners('errorChannelCreation');
    })

    async function previewFiles(event: any) {
      file.value = await imgToBuffer(event);
    }

    function submitIt(name: string) {
      if (verifyChannelName(name) === false) {
        return ;
      }
      chatSocket.emit('createChannel', { name: name, password: '', type: ChannelType.PUBLIC, avatar: file.value });   
    }

    return { submitIt, name, file, previewFiles, created }

  }
})
</script>

<style scoped>
.border {
  border-right: 0.5px solid rgb(196, 192, 207);
}

.spacebottom {
  padding-top: 20px;
  padding-bottom: 24px;
}

.spacetop {
  padding-top: 20px;
  padding-bottom: 20px;
}

.offsetmess {
  padding-right: 10px;
  padding-left: 20px;
}

.offsettitle {

  padding-top: 30px;
  padding-left: 20px;
}

.offsetphoto {
  padding-top: 20px;
}

.row>.col {
  flex-basis: auto;
}

.button {
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: rgb(0,0,255);
}

.buttoncenter {
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  background-color: rgb(0,0,255);
}

.textabovecenter {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);  
}
</style>
