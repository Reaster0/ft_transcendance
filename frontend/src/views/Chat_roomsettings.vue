<template>
  <v-app >
    <v-container fluid >

      <v-toolbar dark color="rgb(0,0,255)">
        <v-btn to="/thechat" icon dark>
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title >
          <div :style="{color: ' #ffffff'}">
            Chat room settings
          </div>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn @click="changeRoomSettings" color = "ffffff" >
            <div :style="{color: ' #ffffff'}">
              SAVE
            </div>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-divider></v-divider>

      <v-radio-group v-model="newType">
        <v-list class="spacetop">
          <v-radio value="public">
            <template v-slot:label>
              <div>
                <p class="font-weight-black">
                  Make the chat room public
                </p>
                <p>
                  Visible and accessible for everyone (except banned users)
                </p>
              </div>
            </template>
          </v-radio>

          <v-divider class="mb-6"></v-divider>

          <v-radio value="private">
            <template v-slot:label>
              <div>
                <p class="font-weight-black">
                  Make the chat room private
                </p>
                <p>
                  Accessible for users that has a direct link (except banned users)
                </p>
              </div>
            </template>
          </v-radio>
          
          <v-divider class="mb-6"></v-divider>

          <v-radio value="protected">
            <template v-slot:label>
              <div>
                <p class="font-weight-black">
                  Make the chat protected or change the password
                </p>
                <p>
                  Accessible by entering correct the password
                </p>
              </div>
            </template>
          </v-radio>
          <v-col cols="12" sm="6">
            <v-text-field clearable label="Set a password" v-model="password"
              placeholder="Password">
            </v-text-field>
          </v-col>
          
          <v-divider class="mb-6"></v-divider>

          <div>
            <p class="font-weight-black offsetmess">
              Change the avatar
            </p>
          </div>
          <v-col cols="12" sm="6" class="offsetmess">
            <input type="file" @change="previewFiles">
          </v-col>
        </v-list> 
      </v-radio-group>
    </v-container>
  </v-app>
</template>

<script lang="ts">

import { onMounted, onUnmounted } from "@vue/runtime-core"
import { defineComponent, ref } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
import { leaveChat, imgToBuffer } from '../helper';
import { Store, useStore } from 'vuex';
import io from 'socket.io-client';
import router from "../router/index";
import { ChannelType } from '../types/chat.types';

export default defineComponent ({
  setup() {

    let store = useStore() as Store<any>;
    let channelId = store.getters.getCurrentChannelId;
    let channelType = store.getters.getCurrentChannelType;
    let chatSocket = store.getters.getChatSocket;
    let newType = ref<any>(null);
    let password = ref<string>('');
    let file = ref<any>(null);
    let forceLeave = false;

    onMounted(async() => {
      try {
        if (!channelId || channelType === null || channelType === ChannelType.PM) {
          alert('Something went wrong. Redirect to chat.');
          router.push('/thechat');
          return ;
        } else if (!chatSocket) {
          const connection = io('ws//:3000/chat',{
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
    })

    onUnmounted(async() => {
      chatSocket.removeAllListeners('disconnect');
    })

		onBeforeRouteLeave(function(to: any, from: any, next: any) {
      chatSocket.removeAllListeners('disconnect');
      void from;
      const socket = store.getters.getChatSocket;
      leaveChat(forceLeave, socket, to, next, store);
    })

    function changeRoomSettings() {
      const array = ['public', 'private', 'protected'];
      if (newType.value == null)
        newType.value = channelType;
      else
        newType.value = array.indexOf(newType.value);
      if (newType.value === ChannelType.PROTECTED && password.value === '') {
        alert('Password can\'t be empty.');
        return ;
      }
      if ((newType.value === channelType && file.value === null)
        || (newType.value === ChannelType.PROTECTED && password.value === '')) {
        alert('No significant change made.');
        return ;
      }
      if (newType.value != ChannelType.PROTECTED) {
        password.value = '';
      }
      chatSocket.emit('editChannel',
        { channelId: channelId, type: newType.value, password: password.value,
        avatar: file.value});
      router.push('/thechat');
    }

    async function previewFiles(event: any) {
      file.value = await imgToBuffer(event);
    }

    return { newType, changeRoomSettings, password, ChannelType, previewFiles };
  }


})
</script>


<style scoped>
.border 
{
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

.offsetphoto {
  padding-top: 20px;
}

.row>.col {
  flex-basis: auto;
}

</style>
