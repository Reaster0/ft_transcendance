<template>
  <v-app id="chat">
    <v-container fluid v-if="update.connected">
      <v-row>
        <!-- ELEMENTS ON LEFT OF SCREEN -->
        <v-col cols="auto" sm="3" class="border" style="height: calc(100vh - 52px);">
          <v-col>
            <!-- SEARCH TOOLS -->
            <v-selection @open="getJoinableChannels"
              @option:selected="initDisplayChannel"
              class="mb-4"
              placeholder="Search channels"
              label="name"
              :options="joinableChannels"
              :value="{channel: chanJoinSelected, isMember: false}">
            </v-selection>
            <v-selection @open="getConnectedUsers"
              class="my-4"
              @option:selected="initDisplayChannel"
              placeholder="Search connected users"
              label="name"
              :options="joinableChannels">
            </v-selection>

            <!-- CREATE NEW ROOM BUTTON -->
            <v-btn :to="{ name: 'NewRoom' }" elevation="2" width="100%"
              class="my-4">
              Create chat room
              <v-divider class="mx-4" vertical></v-divider>
              <v-icon color="rgb(0,0,255)"> mdi-plus </v-icon>
            </v-btn>
          
          </v-col>

          <!-- LIST OF CHANNELS JOINED -->
          <div class="text-left overflow-y-auto margin-top"
            style="max-height: calc(100vh - 40%);">
            <v-list>
              <template v-for="(item, index) in userChannels.channels">
                <v-divider v-if="item.divider" :key="index"
                  :inset="item.inset"></v-divider>
                <v-list-item v-else :key="item.title">
                  <v-btn elevation="0" min-height="50px"  max-width="50px"
                    @click="initDisplayChannel(item, true)"
                    v-if="item.id != currentChannel.id">
                      <v-list-item-avatar>
                        <v-img v-if="item.avatar != null" :src="item.avatar"
                          min-width="50px" min-height="50px"
                          transition="false" loading="lazy">
                        </v-img>
                        <v-avatar v-else color="blue" min-width="50px"
                          min-height="50px">
                          <v-icon color="white">mdi-cat</v-icon>
                        </v-avatar>
                      </v-list-item-avatar>
                  </v-btn>
                  <v-btn elevation="0" min-height="50px"  max-width="50px"
                    v-else>
                    <v-badge bordered bottom color="green" dot offset-x="6"
                      offset-y="34">
                      <v-list-item-avatar v-if="item.avatar != null">
                        <v-img :src="item.avatar" min-width="50px"
                          min-height="50px" transition="false" loading="lazy">
                        </v-img>
                      </v-list-item-avatar>
                      <v-list-item-avatar v-else>
                        <v-avatar color="blue" min-width="50px"
                          min-height="50px">
                          <v-icon color="white">mdi-cat</v-icon>
                        </v-avatar>
                      </v-list-item-avatar>
                    </v-badge>
                  </v-btn>
                  <v-list-item-title class="offsetmess">{{ item.name }}
                  </v-list-item-title>
                </v-list-item>
                <v-divider v-if="index < userChannels.channels.length"
                  :key="index">
                </v-divider>
              </template>
            </v-list>
          </div>
        </v-col>

        <!-- NO CHANNEL DISPLAYED -->
        <v-col cols="auto" sm="9" class="border"
          v-if="currentChannel.id === ''">
          <v-app v-if="currentChannel.id === ''">
              <p class="textfullcenter font-weight-light" data-text="Select">
                Select channel to display
              </p>
          </v-app>
        </v-col>

        <!-- CHANNEL DISPLAY : CENTRAL ELEMENTS -->
        <v-col cols="auto" sm="6" class="border" v-else>
          <v-app id="chatdisplay" v-if="update.messages && update.users
            && currentChannel.name != ''
            && currentChannel.role != Roles.NONMEMBER
            && currentChannel.blocked === false"
            style="max-height: 600px;">

            <!-- MESSAGES DISPLAY -->
            <div id="messagedisplay" class="specialscroll" @scroll="isScrollAtBottom">
              <div v-for="(msg, index) in
                currentChannel.messages.slice().reverse()"
                :key="index" :class="['d-flex flex-row align-center my-2',
                msg.userId == currentUser.id ? 'justify-end': null]">
                <v-card class="d-flex-column" max-width="450px"
                  v-if="msg.userId === currentUser.id"
                  color="rgb(0,0,255)" dark>
                  <v-list-item class="user-message-container">
                    <v-list-item-header>
                      <v-list-item-title class="mb-2 message text-wrap">
                        {{ msg.content }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ msg.date }}
                      </v-list-item-subtitle>
                    </v-list-item-header>
                  </v-list-item>
                </v-card>
                <v-btn elevation="0" min-height="50px"
                  max-width="50px">
                  <v-badge bordered bottom :color="getUserColor(msg.userId)" dot
                    offset-x="4" offset-y="10">
                    <v-avatar class="mt-n4" size="32" elevation="2">
                      <img :src="getUserAvatar(msg.userId)"/>
                    </v-avatar>
                  </v-badge>
                </v-btn>
                <v-card class="mt-2 ml-2" max-width="450px" v-if="msg.userId
                  != currentUser.id">   
                  <v-list-item class="other-message-container">
                    <v-list-item-header>
                      <v-list-item-title class="mb-2 message text-wrap">
                        {{ msg.content }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ msg.date }}
                      </v-list-item-subtitle>
                    </v-list-item-header>
                  </v-list-item>
                </v-card >
              </div>
            </div>

            <!-- NO MESSAGE YET -->
            <div v-if="currentChannel.messages.length === 0">
              <p class="textfullcenter font-weight-light" data-text="Start conversation">
                Start conversation
              </p>  
            </div>

            <!-- SEND MESSAGE -->
            <div class="d-flex" overflow-hidden>
              <v-text-field clearable class="messagefield" width="100%"
                type="text" label="Write a message" v-model="messageText"
                @keyup.enter="sendingMessage(currentChannel.id)">
              </v-text-field>
            </div>
          </v-app>

          <!-- LOADING / NON SELECTED MESSAGES -->
          <v-app v-else-if="currentChannel.id != ''
            && currentChannel.role === Roles.NONMEMBER">
            <p class="textfullcenter font-weight-light" data-text="Non member">
              You are not a room member
            </p>
          </v-app>

          <v-app v-else-if="currentChannel.blocked === true">
            <p class="textfullcenter font-weight-light" data-text="Blocked user">
              You blocked this user
            </p>
          </v-app>  

          <v-app v-else-if="currentChannel.id != ''">
            <p class="textfullcenter font-weight-light" data-text="Loading messages">
              Loading messages
            </p>
          </v-app>


        </v-col>

        <!-- INFOS ON CURRENT/SEARCHED CHAT -->
        <v-col cols="auto" sm="3" class="border">
          
          <!-- CHANNEL DESCRIPTION -->
          <v-card height="100%" class="text-center offsetphoto" shaped
            v-if="currentChannel.id != ''">
            <div v-if="currentChannel.notif">
              <v-badge avatar dark color="warning" bordered offset-x="50px"
                offset-y="5px" content="!">
                <v-avatar class="s" elevation="10" size="60px" color="blue">
                  <img v-if="currentChannel.avatar" :src="currentChannel.avatar"
                    width="70" height="70">
                  <v-icon v-else color="white">mdi-cat</v-icon>
                </v-avatar>
              </v-badge>
            </div>
            <div v-else>
              <v-avatar class="s" elevation="10" size="60px" color="blue">
                <img v-if="currentChannel.avatar" :src="currentChannel.avatar"
                  width="70" height="70">
                <v-icon v-else color="white">mdi-cat</v-icon>
              </v-avatar>
            </div>
            <v-card-title class="layout justify-center">
              {{ currentChannel.name }}
            </v-card-title>
            <v-card-subtitle class="layout justify-center">
              {{ currentChannel.description }}
            </v-card-subtitle>
            
            <!-- CASE CHANNEL -->
            <div id="channel" class="pt-6"
              v-if="currentChannel.type != ChannelType.PM">

              <!-- SUBCASE CHANNEL NOT JOINED -->
              <div v-if="currentChannel.role === Roles.NONMEMBER">
                <v-btn elevation="2" class="my-2" width="80%"
                  @click="joinChannel">
                  Join the chat room
                </v-btn>
                <password-modal :showPasswordModal="showPasswordModal"
                  :togglePasswordModal="togglePasswordModal"
                  @password="joinProtectedChannel">
                </password-modal>
              </div>

              <!-- SUBCASE CHANNEL JOINED -->
              <div v-else>
                <v-btn class="my-1" elevation="2" width="80%" color="warning"
                  @click="leaveChannel">
                  Leave the chat room
                </v-btn>
                <div v-if="currentChannel.type === ChannelType.PRIVATE">
                <v-btn class="my-1" elevation="2" width="80%" color="success"
                  @click="genJoinUrl(currentChannel.id)">
                  Generate invitation link
                </v-btn>
                </div>
                <div v-if="currentChannel.role === Roles.OWNER">
                  <v-btn class="my-1" @click="goToRoomSettings" elevation="2"
                    width="80%">
                    Room settings
                  </v-btn>
                </div>
                <v-btn class="my-1" width="80%" to="/">Return to home</v-btn>

                <!-- INFOS ABOUT CHANNEL USERS  -->
                <div id="app" class="pt-6 overflow-y-auto" style="max-height: calc(100vh - 80%);">
                  <v-tabs fixed-tabs>
                    <v-tab color="rgb(0,0,255)"
                      v-for="(item, index) in channelManager.title"
                      :class="{active: channelManager.displayIndex === index}"
                      @click="channelManager.displayIndex = index" :key="item">
                      {{ channelManager.title[index] }}
                    </v-tab>
                  </v-tabs>
                  <!-- DISPLAY MEMBERS -->
                  <v-card flat class="overflow-y-auto">       
                    <div v-if="channelManager.displayIndex === 0">
                      <v-list>
                        <template v-for="(item, index) in
                          channelManager.members">
                          <v-divider v-if="item.divider" :key="index"
                            :inset="item.inset"></v-divider>
                          <v-list-item v-else :key="item.title">
                            <!-- MANAGE USER BUTTON IF ADMIN -->
                            <div v-if="(currentChannel.role === Roles.ADMIN 
                              || currentChannel.role === Roles.OWNER)
                              && item.id != currentUser.id
                              && item.role != Roles.OWNER">
                              <v-btn @click="goToManageUser(item)" icon
                                elevation="0">
                                <v-app-bar-nav-icon elevation="0">
                                </v-app-bar-nav-icon>
                              </v-btn>
                            </div>
                            <v-btn elevation="0" min-height="50px"
                              max-width="50px">
                              <v-badge bordered bottom
                                :color="getUserColor(item.id)"
                                dot offset-x="6" offset-y="34" >
                                <v-list-item-avatar>
                                  <v-img :src="getUserAvatar(item.id)"
                                    min-width="50px" min-height="50px">
                                  </v-img>
                                </v-list-item-avatar>
                              </v-badge>
                            </v-btn>
                            <v-list-item-title class="offsetmess">
                              {{ getUserName(item.id) }}
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index <
                            channelManager.members.length" :key="index">
                          </v-divider>
                        </template>
                      </v-list>
                    </div>
                    <!-- DISPLAY ADMINS -->
                    <div v-show="channelManager.displayIndex === 1">
                      <v-list>
                        <template v-for="(item, index) in
                          channelManager.admins">
                          <v-divider v-if="item.divider" :key="index"
                            :inset="item.inset">
                          </v-divider>
                          <v-list-item v-else :key="item.title">
                            <!-- MANAGE USER BUTTON IF ADMIN -->
                            <div v-if="(currentChannel.role === Roles.ADMIN 
                              || currentChannel.role === Roles.OWNER)
                              && item.id != currentUser.id
                              && item.role != Roles.OWNER">
                              <v-btn @click="goToManageUser(item)" icon
                                elevation="0">
                                <v-app-bar-nav-icon elevation="0">
                                </v-app-bar-nav-icon>
                              </v-btn>
                            </div>
                            <v-btn elevation="0" min-height="50px"
                              max-width="50px" >
                              <v-badge bordered bottom
                                :color="getUserColor(item.id)"
                                dot offset-x="6" offset-y="34" >
                                <v-list-item-avatar>
                                  <v-img :src="getUserAvatar(item.id)"
                                    min-width="50px" min-height="50px">
                                  </v-img>
                                </v-list-item-avatar>
                              </v-badge>
                            </v-btn>
                            <v-list-item-title class="offsetmess">
                              {{ getUserName(item.id) }}
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider v-if="index <
                            channelManager.admins.length" :key="index">
                          </v-divider>
                        </template>
                      </v-list>
                    </div>
                  </v-card>
                </div>
              </div>
            </div>

            <!-- CASE PRIVATE MESSAGE -->
            <div id="privatemessage" v-else>
              <v-app id="subprivatemessage" class="pt-6">
                <div v-if="currentChannel.role === Roles.NONMEMBER">
                  <v-btn @click="joinPrivateConversation(currentChannel.id)" elevation="2" class="my-2"
                    width="80%">
                    Start conversation
                  </v-btn>
                </div>
                <div v-if="!currentChannel.blocked">
                  <v-btn @click="blockUserControl(true)" elevation="2"
                    class="my-2" width="80%" color="warning">
                    Block this user
                  </v-btn>
                  <v-btn @click="goToUserPage" elevation="2" class="my-1" width="80%">
                    Go to user page
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn @click="blockUserControl(false)" elevation="2"
                    class="my-1" width="80%" color="success">
                    Unblock this user
                  </v-btn>
                </div>
                <div>
                  <v-btn class="my-1" width="80%" to="/">Return to home</v-btn>
                </div>
                <div v-if="currentChannel.role != Roles.NONMEMBER
                  && !currentChannel.blocked
                  && !game.request" class="text-center">
                  <v-btn color="rgb(0,0,255)" @click="waitingGame()"
                  class="my-1" elevation="2" width="80%">
                    <div  :style="{color: ' #ffffff'}">
                      Invite to play together
                    </div>
                  </v-btn>
                </div>
                <div v-if="!game.response" class="text-center">
                  <p>No response from user</p>
                </div>
                <div v-else-if="game.absent" class="text-center">
                  <p>User is absent from chat</p>
                </div>
                <v-toolbar dense  color="rgba(0,0,0,0)">
                  <v-progress-linear :active="game.request"
                    :indeterminate="game.request" absolute bottom
                    color="rgb(0,0,255)">
                  </v-progress-linear>
                </v-toolbar>
              </v-app>
            </div>
          </v-card>  
          <game-modal :showGameModal="showGameModal"
            :toggleGameModal="toggleGameModal"
            :inviter="getUserName(game.inviter)"
            @response="responseGame">
          </game-modal>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-else>
			<p class="textfullcenter font-weight-light" data-text="Loading">
        Loading
      </p>
    </v-container>

  </v-app>
</template>

<script lang="ts">

import { onMounted, onUnmounted } from "@vue/runtime-core"
import io from 'socket.io-client';
import { useStore, Store } from "vuex";
import { ref, defineComponent } from 'vue'
import vSelect from "vue-select";
import PasswordModal from "./Chat_passwordmodal.vue";
import GameModal from "./Chat_gamemodal.vue";
import { onBeforeRouteLeave } from 'vue-router';
import { leaveChat } from '../helper';
import { Status, Message, UserChannel, Channel, ChannelType,
  Roles } from '../types/chat.types';
import { getAvatarID, genJoinLink } from '../components/FetchFunctions';
import "vue-select/dist/vue-select.css";
import router from "../router/index";

export default defineComponent({
  name: "ChatMain",
  components: {
    'password-modal': PasswordModal,
    'game-modal': GameModal,
    'v-selection': vSelect,
  },
	setup() {

		const connection = ref<null | any>(null);
    const store = useStore() as Store<any>;
    const currentUser = useStore().getters.whoAmI as any;
    let usersList = ref<any>(null);
    let userChannels = ref({ channels: [] as any[] });
    let update = ref({ connected: false as boolean, users: false as boolean,
      messages: false as boolean });
    let currentChannel = ref({ name: '' as string, id: '' as string,
      type: ChannelType.PUBLIC as ChannelType, 
      messages: [] as Message[], users: [] as UserChannel[],
      role: Roles.NONMEMBER as Roles, avatar: null as null | string,
      notif: false as boolean, description: '' as string, 
      blocked: false as boolean });
    let channelManager = ref({title: ['all members', 'admins'] as string[],
      members: [] as any[], admins: [] as any[],
      displayIndex: 0 as number });
    let messageText = ref<string>('');
    let searchRequest = ref<string>('');
    let joinableChannels = ref<Channel[]>([]);
    let showPasswordModal = ref<boolean>(false);
    let showGameModal = ref<boolean>(false); //TODO set to true when game invitation is received
    let game = ref({ request: false as boolean, response: true as boolean,
      inviter: null as any, socket: null as any, absent: false as boolean, 
      togame: false as boolean });
    let chanJoinSelected = {name: 'enter channer'} as Channel;
    let confirm =  0 as number;
    let forceLeave = false as boolean;

		onBeforeRouteLeave(function(to: any, from: any, next: any) {
      connection.value!.removeAllListeners('disconnect');
      if (game.value.request === true && forceLeave === false) {
        alert('Wait for end of game request to leave page.');
        return ;
      }
      void from;
      const socket = store.getters.getChatSocket;
      leaveChat(forceLeave, socket, to, next, store);
    })

		onMounted(async() => {
			try {
        connection.value = store.getters.getChatSocket;
        if (connection.value === null) {
          connection.value = io(window.location.protocol + '//:3000/chat',
          { transportOptions: {
              polling: { extraHeaders: { auth: document.cookie} },
            },
          })
          store.commit('setChatSocket' , connection.value);
          store.commit('setUserToManage' , null);
          store.commit('setCurrentChannelId' , null);
          store.commit('setCurrentChannelType', null);
          console.log("starting connection to chat websocket");
        } else {
          connection.value!.emit('getUsersList');
        }
			} catch (error) {
				console.log("the error is:" + error)
			}

      connection.value!.on('disconnect', function() {
        forceLeave = true;
        alert('Something went wrong. You\'ve been disconnected from chat.');
        router.push('/');
      })

      /* Function to receive users and channels data */

      connection.value!.on('usersList', async function(params: any) {
        console.log('get user list');
        for (let user of params) {
          user.avatar = await getAvatarID(user.id) as any; 
        }
        usersList.value = params;
        if (!update.value.connected) {
          connection.value!.emit('emitMyChannels');
        }
      })

      connection.value!.on('channelList', async function(params: Channel[]) {
        userChannels.value.channels = params;
        await avatarToUrl();
        console.log('getchannellist');
        for (let channel of userChannels.value.channels) {
          if (channel.type === ChannelType.PM) {
            let usersId = channel.name.split('/').map(Number);
            if (usersId[0] === currentUser.id) {
              channel.name = getUserName(usersId[1]);
              channel.avatar = getUserAvatar(usersId[1]);
            } else {
              channel.name = getUserName(usersId[0]);
              channel.avatar = getUserAvatar(usersId[0]);
            }
          }
          if (currentChannel.value.id === channel.id) {
            initDisplayChannel(channel, true);
          }
        }
        update.value.connected = true;
      })

      connection.value!.on('channelUsers',
        async function(params: { id: string, users: any[] }) {
        if (!currentChannel.value || params.id != currentChannel.value.id) {
          console.log('error of channel correspondance inside channelUsers '
            + params.id + ' vs '+ currentChannel.value.id);
          return;
        }
        currentChannel.value.users = params.users;
        await setChannelManager();
        update.value.users = true;
      })

      connection.value!.on('channelMessages',
        function(params: { id: string, messages: Message[] }) {
        if (params.id != currentChannel.value.id) {
          console.log('error of channel correspondance inside channelMessages '
            + params.id + ' vs '+ currentChannel.value.id);
          return;
        }
        currentChannel.value.messages = params.messages;
        update.value.messages = true;
      })

      connection.value!.on('newMessage',
        function(params: {id: string, message: Message }) {
        if (params.id != currentChannel.value.id) {
          console.log('receive messageText from non current');
          return ;
        }
        currentChannel.value.messages.push(params.message);
        if (params.message.userId != currentUser.id
          && update.value.messages === true
          && currentChannel.value.blocked === false) {
          currentChannel.value.notif = true;
          isScrollAtBottom(null);
        }
      })

      /* Search function responses */

      connection.value!.on('connectedUsers', async function(params: any ) {
        joinableChannels.value = [];
        for (let user of params) {
          let avatar = await getUserAvatar(user.id);
          joinableChannels.value.push({ id: user.id, name: user.nickname, 
            type: ChannelType.PM, avatar: avatar });
        }
        console.log(joinableChannels.value);
      })

      connection.value!.on('joinableChannels', function(params: Channel[]) {
        joinableChannels.value = params;
      })

      /* Channel management responses */

      connection.value!.on('joinAccepted', function(params: { id: string, isPm: boolean }) {
        connection.value!.emit('emitMyChannels');
        if (params.isPm === false && currentChannel.value.id != params.id) {
          return ;
        } else if (params.isPm === false) {
          alert('Welcome to ' + currentChannel.value.name + ' !');
        } else {
          currentChannel.value.id = params.id;
          alert('You just been added to a new private discussion.');
        }
      })

      connection.value!.on('alreadyInPm', function(params: { name: string }){
        alert('You already have an ongoing conversation with ' + params.name + '.');
      })

      connection.value!.on('wrongPassword', function(){
        alert('You entered the wrong password for '
          + currentChannel.value.name);
      })

      connection.value!.on('leftChannel', function(params: { id: string }) {
        if (currentChannel.value.id != params.id) {
          return ;
        }
        initDisplayChannel(currentChannel.value, false);
        connection.value!.emit('emitMyChannels');
      })

      /* Status management function & warning */

      connection.value!.on('youAreBanned', function(){
        alert('You are banned from ' + currentChannel.value.name + ' !');
      })

      connection.value!.on('newlyBanned', function(params: { id: string, name: string }){
        connection.value!.emit('emitMyChannels');
        if (currentChannel.value.id === params.id) {
          initDisplayChannel(currentChannel.value, false);
        }
        alert('You are banned from ' + params.name + ' !');
      })

      connection.value!.on('muted', function(params: { channelId: string, time: number }) {
        if (params.channelId === currentChannel.value.id) {
          alert('You have been muted from ' + currentChannel.value.name
            + ' for ' + params.time + ' minutes.');
        }
      })

      connection.value!.on('youAreMuted', function(params: { channelId: string, limitdate: string }) {
        if (params.channelId === currentChannel.value.id) {
          alert('You are muted from ' + currentChannel.value.name
            + ' until ' + params.limitdate + '.');
        }
      })

      connection.value!.on('newlyAdmin', function(params: { channelId: string }){
        if (params.channelId === currentChannel.value.id) {
          alert('You are now an admin of ' + currentChannel.value.name + '.');
        }        
      })

      /* Modification of channels */

      connection.value!.on('userChannelModif', function (params: {id: string }){
        if (currentChannel.value.id != params.id) {
          return ;
        }
        connection.value.emit('getChannelUsers', { id: currentChannel.value.id });
      })

      connection.value!.on('channelEdited', function (params: {id: string }){
        void params.id;
        connection.value!.emit('emitMyChannels');
      })

      connection.value!.on('channelDestruction', function (params: {id: string }){          
        connection.value!.emit('emitMyChannels');
        if (currentChannel.value.id != params.id) {
          return ;
        }
        alert('Channel ' + currentChannel.value.name
          + ' is being erased by it\'s owner!');
        currentChannel.value.id = '';
        currentChannel.value.name = '';
        update.value.messages = false;
        update.value.users = false;
      })

      /* Private conversation responses */

      connection.value!.on('blockChange', function(params: { targetId: number }) {
        if (currentChannel.value.type === ChannelType.PM
          && currentChannel.value.users.map(user => user.id)
          .indexOf(params.targetId) !== -1) {
            currentChannel.value.blocked = !currentChannel.value.blocked;
          }
        displayMemberChannel();
      })

      /* Game invitation system */

      connection.value!.on('gameInvitation', function(params: { id: number }) {
        if (showGameModal.value === false && game.value.request === false) {
          game.value.inviter = params.id;
          showGameModal.value = true;
        }
      })

      connection.value!.on('endGameInvit', function(params: { id: number }) {
        showGameModal.value = false;
        alert('You missed or refused a game invitation from '+ getUserName(params.id));
      })

      connection.value!.on('userAbsent', function() {
        game.value.absent = true;
      })

      connection.value!.on('gameAccepted', function(params: { inviter: number, socketId: any }) {
        if (params.inviter != currentUser.id) {
          return ;
        }
        forceLeave = true;
        game.value.togame = true;
        store.commit('setGameSocket', game.value.socket);
        store.commit('setOpponentSocketId', params.socketId);
        router.push('/game');
      })

		})

    onUnmounted(async() => {
      connection.value!.removeAllListeners('wrongPassword');
      connection.value!.removeAllListeners('alreadyInPm');
      connection.value!.removeAllListeners('youAreBanned');
      connection.value!.removeAllListeners('userChannelModif');
      connection.value!.removeAllListeners('usersList');
      connection.value!.removeAllListeners('channelEdited');
      connection.value!.removeAllListeners('leftChannel');
      connection.value!.removeAllListeners('disconnect');
      connection.value!.removeAllListeners('channelDestruction');
      connection.value!.removeAllListeners('channelList');
      connection.value!.removeAllListeners('channelUsers');
      connection.value!.removeAllListeners('channelMessages');
      connection.value!.removeAllListeners('newMessage');
      connection.value!.removeAllListeners('connectedUsers');
      connection.value!.removeAllListeners('joinableChannels');
      connection.value!.removeAllListeners('joinAccepted');
      connection.value!.removeAllListeners('blockChange');
      connection.value!.removeAllListeners('newlyBanned');
      connection.value!.removeAllListeners('newlyAdmin');
      connection.value!.removeAllListeners('muted');
      connection.value!.removeAllListeners('youAreMuted');
      connection.value!.removeAllListeners('userAbsent');
      connection.value!.removeAllListeners('gameInvitation');
      connection.value!.removeAllListeners('endGameInvit');
      connection.value!.removeAllListeners('gameAccepted');
    })

    /* Functions for channel display and management */

    function initDisplayChannel(channel: any, isMember: boolean) {
      confirm = 0;
      if (game.value.request === true) {
        alert('Wait for end of game request before changing channel');
        return ;
      }
      currentChannel.value.name = channel.name;
      currentChannel.value.id = channel.id;
      currentChannel.value.avatar = channel.avatar;
      currentChannel.value.notif = false;
      currentChannel.value.type = channel.type;
      currentChannel.value.blocked = channel.blocked;
      const channelTypes = ['Public Channel', 'Private Channel', 'Protected Channel', 'Private Conversation'];
      currentChannel.value.description = channelTypes[channel.type];
      currentChannel.value.messages = [];
      currentChannel.value.users = [];
      channelManager.value.admins = [];
      channelManager.value.members = [];
      channelManager.value.displayIndex = 0;
      currentChannel.value.role = Roles.NONMEMBER;
      console.log('display ' + currentChannel.value.name + ' join interface');
      update.value.messages = false;
      update.value.users = false;
        if (isMember) {
          return displayMemberChannel();
        }
    }

    function displayMemberChannel() {
      if (game.value.request === true) {
        alert('Wait for end of game request before changing channel');
        return ;
      }
      update.value.messages = false;
      update.value.users = false;
      connection.value.emit('getChannelUsers', { id: currentChannel.value.id });
      if (currentChannel.value.blocked === false) {
        connection.value.emit('getChannelMessages', { id: currentChannel.value.id });
      }
    }

    async function setChannelManager() {
      let members = currentChannel.value.users as UserChannel[];
      let admins = [] as UserChannel[];
      if (currentChannel.value.users === []) {
        console.log('error in retrieving channels users');
        return ;
      }
      for (let user of currentChannel.value.users) {
        if (user.role === Roles.ADMIN || user.role === Roles.OWNER) {
          admins.push(user);
        }
        if (user.id === currentUser.id) {
          currentChannel.value.role = user.role;
        }
      }

      channelManager.value.displayIndex = 0;
      channelManager.value.members = members;
      channelManager.value.admins = admins;
    }

    /* Functions for getting informations about users */

    function getUserName(userId: number) {
      if (usersList.value === null) {
        console.log('Error when retrieving users');
        return;
      }
      for (let user of usersList.value) {
        if (user.id === userId) {
          return user.nickname;
        }
      }
      console.log('Something went wrong: User id ' + userId +
        ' not found in channel ' + currentChannel.value.name);
    }

    function getUserAvatar(userId: number) {
      if (usersList.value === null) {
        console.log('Error when retrieving users');
        return;
      }
      for (let user of usersList.value) {
        if (user.id === userId) {
          return user.avatar;
        }
      }
      console.log('Something went wrong: User id ' + userId + ' not found');
    }

    function getUserStatus(userId: number) {
      if (!usersList.value) {
        console.log('Error when retrieving user avatar');
        return;
      }
      for (let user of usersList.value) {
        if (user.id === userId) {
          return user.status;
        }
      }
      console.log('Something went wrong: User id ' + userId + ' not found');
    }

    function getUserColor(userId: number) {
      const status = getUserStatus(userId) as Status;
      if (status === Status.ONLINE)
        return "green";
      else if (status === Status.PLAYING)
        return "yellow";
      return "grey";
    }

    /* Function for search pannel */

    function getJoinableChannels() {
      connection.value!.emit('getJoinableChannels', currentUser.id);
    }

    function getConnectedUsers() {
      connection.value!.emit('getConnectedUsers');
    }

		function sendingMessage(channelId: string) {
      if (!messageText.value || messageText.value === '')
        return ;
      connection.value.emit('message', {'channelId': channelId,
        'content': messageText.value });
      messageText.value = '';
    }

    /* Functions for channels actions */

    function joinChannel() {
      console.log('join channel', currentChannel.value.name);
      if (currentChannel.value.type === ChannelType.PROTECTED) {
        showPasswordModal.value = true;
        return ;
      }
      connection.value!.emit('joinChannel', {id: currentChannel.value.id,
         password: ''});
    }

    function joinProtectedChannel(password: string) {
      console.log('join channel ' + currentChannel.value.name +
        ' with password: ' + password);
      if (password === '') {
        alert('Password entered is empty. Please retry.');
        return;
      }
      showPasswordModal.value = false;
      connection.value!.emit('joinChannel', {id: currentChannel.value.id,
         password: password});
    }

    function joinPrivateConversation(targetId: string) {
      console.log('join conversation ' + targetId);
      connection.value!.emit('createPrivateConversation', targetId);
    }

    function blockUserControl(block: boolean) {
      let targetId = currentChannel.value.users[0].id;
      if (currentChannel.value.users[0].id === currentUser.id) {
        targetId = currentChannel.value.users[1].id;
      }
      connection.value!.emit('blockUserControl', { targetId: targetId, block: block });
    }

    function leaveChannel() {
      console.log('leave channel ' + currentChannel.value.name);
      if (currentChannel.value.role === Roles.OWNER && confirm === 0) {
        confirm++;
        alert('\tYou\'re the channel owner: It will be erased.\nPlease click another time on \'Leave Channel\' to confirm.');
        return;
      }
      confirm = 0;
      connection.value!.emit('leaveChannel', { id: currentChannel.value.id });
    }

    /* Functions for game invitation system */

    function waitingGame() {
      game.value.request = true;
      if (game.value.socket === null) {
        game.value.socket = io('http://:3000/game',
          { transportOptions: {
              polling: { extraHeaders: { auth: document.cookie }},
              withCredentials: true
          }});
        game.value!.socket.emit('fromChat');
      }
      connection.value!.emit('sendGameInvit', { channelId: currentChannel.value.id });
      let count = 0;
      const intervalId = setInterval(() => {
        if (game.value.togame === true) {
          goToGame();
        } else if (game.value.absent === true || count === 100) {
          if (count === 100) {
            game.value.response = false;
          }
          noResponse();
          clearInterval(intervalId);
        }
        count++;
      }, 100);

    }

    function noResponse() {
      connection.value!.emit('endGameInvit', { channelId: currentChannel.value.id });
      game.value.socket.disconnect();
      game.value.request = false;
      game.value.socket = null;
      if (game.value.absent === true || game.value.response === false) {
        setTimeout(() => {
          game.value.response = true;
          game.value.absent = false;
        }, 10000);
      }
    }

    function responseGame(response: boolean) {
      if (response === false) {
        return ;
      }
      showGameModal.value = false;
      if (game.value.socket === null) {
        game.value.socket = io('http://:3000/game',
          { transportOptions: {
              polling: { extraHeaders: { auth: document.cookie }},
              withCredentials: true
          }});
      }
      connection.value!.emit('acceptGameInvit', { inviter: game.value.inviter, socketId: game.value.socket.id });
      store.commit('setGameSocket', game.value.socket);
      forceLeave = true;
      router.push('/game');
    }

    function goToGame() {

    }

    /* Utilities function */

    async function avatarToUrl() {
      for (let channel of userChannels.value.channels) {
          if (channel.avatar && channel.type != ChannelType.PM
            && !/blob/.test(channel.avatar)) {
            let blob = new Blob([channel.avatar]) as Blob;
            channel.avatar = URL.createObjectURL(blob);
        }
      }
    }

    function isScrollAtBottom(event: any) {
      let scrollTop = 0;
      if (event === null && document.querySelector("#messagedisplay") !== null) {
        scrollTop = document.querySelector("#messagedisplay")!.scrollTop;
      } else {
        scrollTop = event.target.scrollTop;
      }
      if (scrollTop >= -100) {
        if (currentChannel.value) {
          currentChannel.value.notif = false;
        }
      }
    }

    function togglePasswordModal() {
      showPasswordModal.value = false;
    }

    function toggleGameModal() {
      showGameModal.value = false;
    }
    
   function dropdownShouldOpen(VueSelect:any) {
      return VueSelect.search.length !== 0 && VueSelect.open
    }

    async function genJoinUrl(channelId: string) {
      const res = await genJoinLink(channelId);
      alert('invitation link: ' + res);
    }

    /* Sub routes functions */

    function goToManageUser(user: UserChannel) {
      let userToManage = null as any;
      for (let globalUser of usersList.value) {
        if (globalUser.id === user.id) {
          userToManage = globalUser;
          break;
        }
      }
      userToManage.role = user.role;
      store.commit('setCurrentChannelId', currentChannel.value.id);
      store.commit('setUserToManage', userToManage);
      router.push('/mu');
    }

    function goToRoomSettings() {
      store.commit('setCurrentChannelId', currentChannel.value.id);
      store.commit('setCurrentChannelType', currentChannel.value.type);
      router.push('/roomsettings');
    }

    function goToUserPage() {
        router.push("/user/" + currentChannel.value.name);
    }

		return { update, messageText, userChannels, displayMemberChannel,
      currentChannel, currentUser, getUserName, getUserAvatar, getUserStatus,
      getUserColor, sendingMessage, searchRequest, joinableChannels,
      avatarToUrl, isScrollAtBottom, ChannelType, togglePasswordModal,
      showPasswordModal, joinChannel, joinProtectedChannel, Roles, waitingGame,
      game, blockUserControl, leaveChannel, initDisplayChannel,
      dropdownShouldOpen, getJoinableChannels, channelManager, showGameModal,
      toggleGameModal, responseGame, getConnectedUsers, chanJoinSelected,
      genJoinUrl, goToManageUser, goToRoomSettings, joinPrivateConversation,
      goToUserPage }
	},
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

.offsetphoto {
  padding-top: 20px;
}

.row>.col {
  flex-basis: auto;
}

.messagefield{
  width:100%;
}

.margin-top {
  margin-top: 6%;
}

.specialscroll {
  overflow: auto;
  display: flex;
  flex-direction:column-reverse;
  height: 78%;
  padding-top: 5%;
  padding-bottom: 5%;
  margin-top: 5%;
  margin-bottom: 2%;
}

.textfullcenter {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);  
  font-size: 1.2em;
}

.message {
  word-wrap: break-word;
}

.user-message-container {
  max-width: 100%;
  color: #ffffff;
}

.other-message-container {
  max-width:100%;
}

.message-name {
  color: grey;
}

.notification {
  color: red;
}
</style>
