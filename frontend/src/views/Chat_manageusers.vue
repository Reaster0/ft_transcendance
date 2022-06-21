<template>
  <v-app >
    <v-container fluid >
        <div id="app">
          <v-app id="inspire">
            <div class="text-center">
                <v-card>
                  <v-list>
                    <v-list-item>
                      <v-card color="rgba(0,0,0,0)" flat >
                        <v-toolbar dense color="rgba(0,0,0,0)">
                          <v-btn elevation="0" min-height="50px"  max-width="50px">
                            <v-avatar class="col" elevation="10" size="40px">
                              <img :src="userToManage.avatar" width="50" height="50">
                            </v-avatar>
                          </v-btn>
                          <v-toolbar-title class="offsetmess">
                            {{ userToManage.nickname }}
                          </v-toolbar-title>
                        </v-toolbar>
                      </v-card>
                    </v-list-item>
                  </v-list>
          
                  <v-divider></v-divider>
          
                  <v-list>
                    <div>
                    <p align="left" class="font-weight-black offsetmess spacetoponly">
                      Ban this user indefinetly (non revocable !)
                    </p>
                    </div>
                    <v-list-item>
                      <v-list-item-action >
                        <v-switch
                          v-model="ban"
                          color="blue"
                        ></v-switch>
                      </v-list-item-action>
                      <br>
                    </v-list-item>

                    <div>
                    <p align="left" class="font-weight-black offsetmess">
                      Mute this user for 30 days
                    </p>
                    </div>
                    <v-list-item>
                      <v-list-item-action >
                        <v-switch
                          v-model="mute"
                          color="blue"
                        ></v-switch>
                      </v-list-item-action>
                      <br>
                    </v-list-item>

                    <div>
                    <p align="left" class="font-weight-black offsetmess">
                      Set this user as admin of the chat
                    </p>
                    </div>
                    <v-list-item>
                      <v-list-item-action >
                        <v-switch
                          v-model="admin"
                          color="blue"
                        ></v-switch>
                      </v-list-item-action>
                      <br>
                    </v-list-item>

                  </v-list>
          
                  <v-card-actions>
                    <v-spacer></v-spacer>
          
                    <v-btn
                      to="/thechat"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="rgb(0,0,255)"
                      @click="manageUser"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>

            </div>
          </v-app>
        </div>
    </v-container>
  </v-app>
</template>



<script lang="ts">

import { onMounted } from "@vue/runtime-core"
import { defineComponent, ref } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
import { leaveChat } from "../helper";
import { Store, useStore } from 'vuex';
import io from 'socket.io-client';
import router from "../router/index";

export default defineComponent ({
  setup() {

    let store = useStore() as Store<any>;
    let channelId = store.getters.getCurrentChannelId;
    let userToManage = ref<any>(store.getters.getUserToManage);
    let socketVal = store.getters.getSocketVal;
    let ban = ref<boolean>(false);
    let mute = ref<boolean>(false);
    let admin = ref<boolean>(false);


    onMounted(async() => {
      console.log(userToManage.value);
      try {
        if (!channelId || !userToManage.value) {
          alert('Something went wrong. Redirect to chat.');
          router.push('/thechat');
          return ;
        } else if (!socketVal) {
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
    })

		onBeforeRouteLeave(function(to: any, from: any, next: any) {  
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next, store);
    })

    function manageUser() {
      if (ban.value && (mute.value || admin.value) || (mute.value && admin.value)) {
        alert('You can only choose ONE option.');
        return;
      }
      if (ban.value) {
        socketVal.emit('banUser',
          { channelId: channelId, userId: userToManage.value.id});
      } else if (mute.value) {
        socketVal.emit('muteUser',
          { channelId: channelId, userId: userToManage.value.id});        
      } else {
        socketVal.emit('giveAdminRights',
          { channelId: channelId, userId: userToManage.value.id});
      }
      router.push('/thechat');
    }

    return { userToManage, ban, mute, admin, manageUser };
  }
});
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

.spacetoponly {
  padding-top: 20px;
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
