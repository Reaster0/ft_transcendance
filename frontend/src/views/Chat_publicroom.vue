<template>
  <v-app >
    <v-container fluid>
      <div v-if="!created">
        <v-form @submit.prevent="submitIt(name, file)">

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

import { onMounted } from "@vue/runtime-core";
import { defineComponent, reactive, ref } from "vue";
import { useStore, Store } from "vuex";
import { onBeforeRouteLeave } from "vue-router";
import { ChannelType } from '../types/chat.types';
import { leaveChat, verifyChannelName } from '../helper';
import io from 'socket.io-client';

export default defineComponent({
  name: "NewRoomPublic",
  setup() {
    const store = reactive(useStore() as Store<any>);
    let socketVal = store.getters.getSocketVal;
    let name = ref<string>('');
    let file = ref<any>(null);
    let created = ref<boolean>(false);

    onBeforeRouteLeave( function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next, store);
    })

    onMounted(() => {
      try {
        if (!socketVal) {
          const connection = io(window.location.protocol + '//' + window.location.hostname + ':3000/chat',{
            transportOptions: {
              polling: { extraHeaders: { auth: document.cookie} },
            },
          })
          store.commit('setSocketVal' , connection);
          console.log("starting connection to websocket");
          socketVal = store.getters.getSocketVal;
        }
      } catch (error) {
        console.log("the error is:" + error)
      }

      socketVal.on("channelCreated", function(channel: string) {
        if (channel === name.value) {
          created.value = true;
        }
      })

      socketVal.on("errorChannelCreation", function(reason: string) {
        alert("Channel creation failed: " + reason);
      })
    })

    function previewFiles(event: any) {
        file.value = event.target.files[0];
    }

    function submitIt(name: string, file: any) {
      if (verifyChannelName(name) === false) {
        return ;
      }
      socketVal.emit('createChannel', { name: name, password: '', type: ChannelType.PUBLIC, avatar: file });   
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
