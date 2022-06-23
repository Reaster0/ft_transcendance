<template>
  <v-app >
    <v-container fluid>

      <div class="d-flex">
        <h3>Please, choose a type of new chat room</h3>
        <v-spacer />
        <v-btn to="/thechat" x-small fab>
          <v-icon color="rgb(0,0,255)">mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="spacetopplus">
        <p class="font-weight-black">
          Public chat 
        </p>
        <p>
          Visible and accessible for anyone
        </p>
        <v-btn color="rgb(0,0,255)" width="240px" to="/publicroom">
          <div :style="{color: ' #ffffff'}">
            Create public room
          </div>
        </v-btn>
      </div>

      <v-divider ></v-divider>

      <div class="spacetopplus">
        <p class="font-weight-black">
          Private chat 
        </p>
        <p>
          Accessible for users that has a direct link
        </p>
        <v-btn color = "rgb(0,0,255)" width="240px" to="/privateroom">
          <div :style="{color: ' #ffffff'}">
            Create private room
          </div>
        </v-btn>
      </div>

      <v-divider></v-divider>

      <div class="spacetopplus">
        <p class="font-weight-black">
          Protected chat 
        </p>
        <p>
          Accessible by the password
        </p>
        <v-btn color = "rgb(0,0,255)" width="240px" to="/protectedroom">
          <div :style="{color: ' #ffffff'}">
            Create protected room
          </div>
        </v-btn>
      </div>

    </v-container>
  </v-app>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
import { Store, useStore } from 'vuex';
import { leaveChat } from '../helper';
import { onMounted, onUnmounted } from "@vue/runtime-core"
import io from 'socket.io-client';
import router from "../router/index";

export default defineComponent({
  name: "NewRoom",
  setup () {
    let store = useStore() as Store<any>;
    let socketVal = store.getters.getSocketVal;
    let forceLeave = false;

    onBeforeRouteLeave(function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(forceLeave, socket, to, next, store);
    })

    onMounted(() => {
      try {
        console.log('socket val: ' + socketVal);
        if (!socketVal) {
          console.log('new connection !');
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

      socketVal.on('disconnect', function() {
        forceLeave = true;
        alert('Something went wrong. You\'ve been disconnected from chat.');
        router.push('/');
      })
    })

    onUnmounted(async() => {
      socketVal.removeAllListeners('disconnect');
    })
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
.spacetopplus {
  padding-top: 30px;
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
