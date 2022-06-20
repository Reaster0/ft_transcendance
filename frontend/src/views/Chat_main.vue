<template>
  <v-app id="chat">
    <v-container fluid v-if="update.connected">
      <v-row>
        <!-- ELEMENTS ON LEFT OF SCREEN -->
        <v-col cols="auto" sm="3" class="border">
          <v-col>
            <!-- SEARCH PANNEL -->
              <!--
            <div class="d-flex" overflow-hidden>
              <v-text-field clearable label="Find user or group to chat"
              type="text" placeholder="Search" 
              height = "50px" v-model="searchRequest"
              @keyup.enter="sendingSearchRequest()"
              ></v-text-field>
            </div>
            <v-select 
            label="name"
            v-model="searchRequest"
            :option="joinableChannels"
            :dropdown-should-open="dropdownShouldOpen"
            :dropdown-should-open="dropdownShouldOpen"

            ></v-select>
            </div>
            :dropdown-should-open="dropdownShouldOpen"
            -->
            <div id="joinableChannels" class="searchtool-one">
              <h1 class="Spotnik"> Search channel </h1>
              <v-selection @open="getJoinableChannels"
                @option:selected="initDisplayChannel"
                label="name"
                :options="joinableChannels"
                :value="chanJoinSelected">
              </v-selection>
            </div>
            
            <div id="joinableUsers" class="searchtool-two">
              <h4 class="Spotnik"> Search user </h4>
              <v-selection @open="getConnectedUsers"
                @option:selected="initDisplayChannel"
                label="name"
                :options="joinableChannels">
              </v-selection>
            </div>

            <!-- CREATE NEW ROOM BUTTON -->
            <v-btn :to="{ name: 'NewRoom' }" elevation="2" width="100%">
              Create chat room
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn>
          
          </v-col>

          <!-- LIST OF CHANNELS JOINED -->
          <div class="text-left overflow-y-auto margin-top"
            style="max-height: calc(100vh - 18%);">
            <v-list>
              <v-list-item-group> 
                <template v-for="(item, index) in userChannels.channels">
                  <v-subheader v-if="item.header" :key="item.header"
                    v-text="item.header"></v-subheader>
                  <v-divider v-else-if="item.divider" :key="index"
                    :inset="item.inset"></v-divider>
                  <v-list-item v-else :key="item.title">
                    <v-btn elevation="0" min-height="50px"  max-width="50px"
                      @click="initDisplayChannel(item)"
                      v-if="item.id != currentChannel.id">
                        <v-list-item-avatar>
                          <v-img v-if="item.avatar != null" :src="item.avatar"
                            min-width="50px" min-height="50px"
                            transition="false" loading="lazy">
                          </v-img>
                          <v-avatar v-else color="blue" min-width="50px"
                            min-height="50px">
                            <v-icon color="white">mdi-duck</v-icon>
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
                            <v-icon color="white">mdi-duck</v-icon>
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
              </v-list-item-group>
            </v-list>
          </div>
        </v-col>

        <!-- NO CHANNEL DISPLAYED -->
        <v-col cols="auto" sm="9" class="border"
          v-if="currentChannel.id === ''">
          <v-app v-if="currentChannel.id === ''">
              <h1 class="Spotnik textfullcenter" data-text="Select">
                Select channel to display
              </h1>
          </v-app>
        </v-col>

        <!-- CHANNEL DISPLAY : CENTRAL ELEMENTS -->
        <v-col cols="auto" sm="6" class="border" v-else>
          <v-app id="chatdisplay" v-if="update.messages && update.users
            && currentChannel.name != ''
            && currentChannel.role != Roles.NONMEMBER"
            style="max-height: 600px;">

            <!-- MESSAGES DISPLAY -->
            <div class="specialscroll" @scroll="isScrollAtBottom">
              <div v-for="(msg, index) in
                currentChannel.messages.slice().reverse()"
                :key="index" :class="['d-flex flex-row align-center my-2',
                msg.userId == currentUser.id ? 'justify-end': null]">
                <v-card class="d-flex-column" max-width="450px"
                  v-if="msg.userId === currentUser.id" :key="index"
                  color="rgb(0,0,255)" dark>
                  <v-list-item>
                    <v-list-item-content class="user-message-container">
                      <div class="mb-2 message">
                        {{ msg.content }} </div>
                      <v-list-item-subtitle>
                        {{ msg.date }} </v-list-item-subtitle>
                    </v-list-item-content>
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
                  != currentUser.id" :key="index">   
                  <v-list-item>
                    <v-list-item-content class="other-message-container">
                      <v-list-item-title class="message-name">
                        {{ getUserName(msg.userId) }}
                      </v-list-item-title>
                      <div class="mb-2 message">
                        {{ msg.content }}
                      </div>
                      <v-list-item-subtitle>
                        {{ msg.date }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card >
              </div>
            </div>

            <!-- NO MESSAGE YET -->
            <div v-if="currentChannel.messages.length === 0">
              <h1 class="Spotnik textfullcenter" data-text="Start conversation">
                Start conversation
              </h1>  
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
            <h1 class="Spotnik textfullcenter" data-text="Non member">
              You are not a room member
            </h1>
          </v-app>

          <v-app v-else-if="currentChannel.id != ''">
            <h1 class="Spotnik textfullcenter" data-text="Loading messages">
              Loading messages
            </h1>
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
                  <v-icon v-else color="white">mdi-duck</v-icon>
                </v-avatar>
              </v-badge>
            </div>
            <div v-else>
              <v-avatar class="s" elevation="10" size="60px" color="blue">
                <img v-if="currentChannel.avatar" :src="currentChannel.avatar"
                  width="70" height="70">
                <v-icon v-else color="white">mdi-duck</v-icon>
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
                <div v-if="currentChannel.role === Roles.ADMIN
                  || currentChannel.role === Roles.OWNER">
                  <v-btn class="my-1" :to="{ name: 'ChangeRoom' }" elevation="2"
                    width="80%">
                    Room settings
                  </v-btn>
                </div>
                <v-btn class="my-1" width="80%" to="/">Return to home</v-btn>

                <!-- INFOS ABOUT CHANNEL USERS  -->
                <div id="app" class="pt-6">
                  <v-tabs fixed-tabs>
                    <v-tabs-slider color="rgb(0,0,255)"></v-tabs-slider>
                    <v-tab color="rgb(0,0,255)"
                      v-for="(item, index) in channelManager.title"
                      :class="{active: channelManager.displayIndex === index}"
                      @click="channelManager.displayIndex = index" :key="item">
                      {{ channelManager.title[index] }}
                    </v-tab>
                  </v-tabs>
                  <!-- DISPLAY MEMBERS -->
                  <v-tabs-items>
                    <v-card flat class="overflow-y-auto">       
                      <div v-if="channelManager.displayIndex === 0">
                        <v-list>
                          <v-list-item-group>
                            <template v-for="(item, index) in
                              channelManager.members">
                              <v-subheader v-if="item.header" :key="item.header"
                                v-text="item.header"></v-subheader>
                              <v-divider v-else-if="item.divider" :key="index"
                                :inset="item.inset"></v-divider>
                              <v-list-item v-else :key="item.title">
                                <!-- MANAGE USER BUTTON IF ADMIN -->
                                <div v-if="currentUser.role === Roles.ADMIN 
                                  || currentUser.role === Roles.OWNER">
                                  <v-btn :to="{ name: 'ManageUsers' }" icon
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
                                <v-list-item-content>
                                  <v-list-item-title class="offsetmess">
                                    {{ getUserName(item.id) }}
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-divider v-if="index <
                                channelManager.members.length" :key="index">
                              </v-divider>
                            </template>
                          </v-list-item-group>
                        </v-list>
                      </div>
                      <!-- DISPLAY ADMINS -->
                      <div v-show="channelManager.displayIndex === 1">
                        <v-list>
                          <v-list-item-group>
                            <template v-for="(item, index) in
                              channelManager.admins">
                              <v-subheader v-if="item.header" :key="item.header" 
                                v-text="item.header">
                              </v-subheader>
                              <v-divider v-else-if="item.divider" :key="index"
                                :inset="item.inset">
                              </v-divider>
                              <v-list-item v-else :key="item.title">
                                <!-- MANAGE USER BUTTON IF ADMIN -->
                                <div v-if="currentUser.role === Roles.ADMIN 
                                  || currentUser.role === Roles.OWNER">
                                  <v-btn :to="{ name: 'ManageUsers' }" icon
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
                                <v-list-item-content>
                                  <v-list-item-title class="offsetmess">
                                    {{ getUserName(item.id) }}
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-divider v-if="index <
                                channelManager.admins.length" :key="index">
                              </v-divider>
                            </template>
                          </v-list-item-group>
                        </v-list>
                      </div>
                    </v-card>
                  </v-tabs-items>
                </div>
              </div>
            </div>

            <!-- CASE PRIVATE MESSAGE -->
            <div id="privatemessage" v-else>
              <v-app id="subprivatemessage" class="pt-6">
                <div v-if="currentChannel.role === Roles.NONMEMBER">
                  <v-btn @click="joinChannel" elevation="2" class="my-2"
                    width="80%">
                    Start conversation
                  </v-btn>
                </div>
                <div v-if="!currentChannel.blocked">
                  <v-btn @click="blockUser" elevation="2"
                    class="my-2" width="80%" color="warning">
                    Block this user
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn @click="unblockUser" elevation="2"
                    class="my-2" width="80%" color="success">
                    Unblock this user
                  </v-btn>
                </div>
                <div v-if="currentChannel.role != Roles.NONMEMBER
                  && !currentChannel.blocked
                  && !game.request" class="text-center">
                  <v-btn color="rgb(0,0,255)" @click="waitingGame()"
                  class="my-2" elevation="2" width="80%">
                    <div  :style="{color: ' #ffffff'}">
                      Invite to play together
                    </div>
                  </v-btn>
                </div>
                <div v-if="!game.response" class="text-center">
                  <p>No response from user</p>
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
            :inviter="game.inviter"
            @responseGame="responseGame">
          </game-modal>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-else>
			<h1 class="Spotnik textfullcenter" data-text="Loading">Loading</h1>
    </v-container>

  </v-app>
</template>

<script lang="ts">
import { onMounted } from "@vue/runtime-core"
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
import { getAvatarID } from '../components/FetchFunctions';
import "vue-select/dist/vue-select.css";



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
      role: Roles.USER as Roles, avatar: null as null | string,
      notif: false as boolean, description: '' as string, 
      blocked: false as boolean });
    let channelManager = ref({title: ['members', 'admins'] as string[],
      members: [] as any[], admins: [] as any[],
      displayIndex: 0 as number });
    let messageText = ref<string>('');
    let searchRequest = ref<string>('');
    let joinableChannels = ref<Channel[]>([]);
    let showPasswordModal = ref<boolean>(false); // TODO set to true when click on join a protected channel
    let showGameModal = ref<boolean>(false); //TODO set to true when game invitation is received
    let game = ref({ request: false as boolean, response: true as boolean,
      inviter: '' as string });
    let chanJoinSelected = {name: 'enter channer'} as Channel;

		onBeforeRouteLeave(function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next, store);
    })

		onMounted(async() => {
			try {
        connection.value = store.getters.getSocketVal;
        if (connection.value === null) {
          connection.value = io(window.location.protocol + '//' +
            window.location.hostname + ':3000/chat',{
            transportOptions: {
              polling: { extraHeaders: { auth: document.cookie} },
            },
          })
          store.commit('setSocketVal' , connection.value);
          console.log("starting connection to websocket");
        } else {
          connection.value!.emit('getUsersList');
        }
			} catch (error) {
				console.log("the error is:" + error)
			}

      connection.value!.on('usersList', async function(params: any) {
        console.log('receive new users list');
        for (let user of params) {
          user.avatar = await getAvatarID(user.id) as any; 
        }
        usersList.value = params;
        store.commit('setUsersList', usersList.value);
        if (!update.value.connected) {
          connection.value!.emit('emitMyChannels');
        }
      })

      connection.value!.on('channelList', function(params: Channel[]) {
        console.log('list of joined channels received');
        userChannels.value.channels = params;
        avatarToUrl();
        update.value.connected = true;
      })

      connection.value!.on('joinableChannels', function(params: Channel[]) {
        joinableChannels.value = params;
        console.log(joinableChannels.value);
      })

      connection.value!.on('channelUsers',
        async function(params: { id: string, users: any[] }) {
        if (!currentChannel.value || params.id != currentChannel.value.id) {
          console.log('error of channel correspondance inside channelUsers '
            + params.id + ' vs '+ currentChannel.value.id);
          return;
        }
        console.log('receive users from channel ' + currentChannel.value.name);
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
        console.log('receive messages from channel ' + currentChannel.value.name);
        currentChannel.value.messages = params.messages;
        update.value.messages = true;
      })

      connection.value!.on('connectedUsers', async function(params: any ) {
        console.log('receive connectedUsers');
        joinableChannels.value = [];
        for (let user of params) {
          let avatar = await getUserAvatar(user.id);
          joinableChannels.value.push({ id: user.id, name: user.nickname, 
            type: ChannelType.PM, avatar: avatar });
        }
        console.log(joinableChannels.value);
      })

      connection.value!.on('newMessage',
        function(params: {id: string, message: Message }) {
        if (params.id != currentChannel.value.id) {
          console.log('receive messageText from non current');
          return ;
        }
        console.log('incoming messageText');
        currentChannel.value.messages.push(params.message);
        if (params.message.userId != currentUser.value.id) {
          currentChannel.value.notif = true;
        }
      })

      connection.value!.on('gameInvitation', function(params: { id: number }) {
        //TODO
        game.value.inviter = getUserName(params.id);
        showGameModal.value = true;
      })
		})

    /* Functions for channel display and management */

    function checkIfUserIsMember(channelId: string) {
      const channelsToCheck = userChannels.value.channels as Channel[];
      const found = channelsToCheck
        .find(channelsToCheck => channelsToCheck.id === channelId);
      if (!found) {
        return false;
      }
      return true;
    }

    function initDisplayChannel(channel: any) {
      currentChannel.value.name = channel.name;
      currentChannel.value.id = channel.id;
      currentChannel.value.notif = false;
      currentChannel.value.type = channel.type;
      currentChannel.value.blocked = false; // TODO modify accordingly
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
      if (checkIfUserIsMember(channel.id) === true) {
        return displayMemberChannel(channel);
      }
    }

    function displayMemberChannel(channel: any) {
      console.log('ask for ' + channel.name + ' users and messages');
      update.value.messages = false;
      update.value.users = false;
      connection.value.emit('getChannelUsers', { id: channel.id });
      connection.value.emit('getChannelMessages', { id: channel.id });
    }

    async function setChannelManager() {
      let members = [] as UserChannel[];
      let admins = [] as UserChannel[];
      if (currentChannel.value.users === []) {
        console.log('error in retrieving channels users');
        return ;
      }
      for (let user of currentChannel.value.users) {
        //console.log(user);
        members.push(user);
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
      console.log(status);
      if (status === Status.ONLINE)
        return "green";
      else if (status === Status.PLAYING)
        return "yellow";
      return "grey";
    }

    /* Function for search pannel */

    function getJoinableChannels() {
      connection.value.emit('getJoinableChannels', currentUser.id);
    }

    function getConnectedUsers() {
      connection.value.emit('getConnectedUsers');
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
      console.log('join channel');
      if (currentChannel.value.type === ChannelType.PROTECTED) {
        showPasswordModal.value = true;
        return ;
      }
      //TODO emit to back to join channel
      //TODO if user is blocked from channel / user, get message
    }

    function joinProtectedChannel(password: string) {
      console.log('join channel with password: ' + password);
      if (password === '') {
        alert('Password entered is empty. Please retry.');
        return;
      }
      showPasswordModal.value = false;
      //TODO emit to back to join channel
    }

    function blockUser() {
      //TODO
    }

    function unblockUser() {
      //TODO
    }

    function leaveChannel() {
      //TODO
    }

    /* Functions for game invitation system */

    function waitingGame() {
      game.value.request = true;
      // TODO send game request
      setTimeout(() => (
        game.value.request = false,
        game.value.response = false
        ), 10000);
    }

    function responseGame(responseGame: true) {
      console.log('game response ' + responseGame);
      showGameModal.value = false;    
      // TODO emit answer  
    }

    /* Utilities function */

    function avatarToUrl() {
      for (let channel of userChannels.value.channels) {
          if (channel.avatar && !/blob/.test(channel.avatar)) {
            let blob = new Blob([channel.avatar]) as Blob;
            channel.avatar = URL.createObjectURL(blob);
        }
      }
    }

    function log(log: string) {
      console.log('log: ' + log);
      return true;
    }

    function isScrollAtBottom(event: any) {
      const { scrollTop } = event.target;
      if (scrollTop === 0) {
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

    function testUniq(params: any) {
      console.log('test ' + params);
    }

		return { update, messageText, userChannels, displayMemberChannel,
      currentChannel, currentUser, getUserName, getUserAvatar, getUserStatus,
      getUserColor, sendingMessage,
      searchRequest, joinableChannels, avatarToUrl, log, isScrollAtBottom,
      ChannelType, togglePasswordModal, showPasswordModal, joinChannel, 
      joinProtectedChannel, Roles, waitingGame, game, blockUser,
      unblockUser, leaveChannel, initDisplayChannel, dropdownShouldOpen, 
      getJoinableChannels, channelManager, showGameModal, toggleGameModal,
      responseGame, getConnectedUsers, chanJoinSelected,
      testUniq }
	},
})
</script>


<style scoped>
.searchtool-one {
  padding-bottom: 2%;
}
.searchtool-two {
  padding-bottom: 10%;
}

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
