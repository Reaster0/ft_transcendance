<template>
  <v-app>
    <v-container fluid v-if="update.connected">
      <v-row>

        <!-- ELEMENTS ON LEFT OF SCREEN -->
        <v-col cols="auto" sm="3" class="border">
          <v-col>
            <!-- SEARCH PANNEL -->
            <!-- NB! When serach field will work on backen -
            add onclick option calling method  -->
            <div class="d-flex" overflow-hidden>
              <v-text-field clearable label="Find user or group to chat"
              type="text" placeholder="Search" 
              height = "50px" v-model="searchRequest"
              @keyup.enter="sendingSearchRequest()"
              ></v-text-field>
            </div>

            <!-- CREATE NEW ROOM BUTTON -->
            <v-btn :to="{ name: 'NewRoom' }" elevation="2" width="100%">
              Create chat room
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn>
          
          </v-col>

          <!-- LIST OF CHANNELS JOINED -->
          <div class="text-left overflow-y-auto margin-top" style="max-height: calc(100vh - 15%);">
              <v-list>
               <v-list-item-group> 
                <template v-for="(item, index) in userChannels.channels">
                  <v-subheader v-if="item.header" :key="item.header"
                    v-text="item.header"></v-subheader>
                  <v-divider v-else-if="item.divider" :key="index"
                    :inset="item.inset"></v-divider>
                  <v-list-item v-else :key="item.title">
                    <v-btn elevation="0" min-height="50px"  max-width="50px"
                      @click="displayChannel(item)"
                      v-if="item.id != currentChannel.id">
                        <v-list-item-avatar>
                          <v-img v-if="item.avatar != null" :src="item.avatar"
                            min-width="50px" min-height="50px" transition="false"
                            loading="lazy"></v-img>
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
                    :key="index"></v-divider>
                </template>
                </v-list-item-group>
              </v-list>
          </div>
        </v-col>

        <!-- NO CHANNEL DISPLAYED -->
        <v-col cols="auto" sm="9" class="border" v-if="currentChannel.id === ''">
          <v-app v-if="currentChannel.id === ''">
              <h1 class="Spotnik textfullcenter" data-text="Select">Select channel to display</h1>
          </v-app>
        </v-col>

        <!-- CHANNEL DISPLAY : CENTRAL ELEMENTS -->
        <v-col cols="auto" sm="6" class="border" v-else>
          <v-app id="chatdisplay" v-if="update.messages && update.users
            && currentChannel.name != '' && currentChannel.member"
            style="max-height: 600px;">

            <!-- MESSAGES DISPLAY -->
            <div class="specialscroll" @scroll="isScrollAtBottom">
              <div v-for="(msg, index) in currentChannel.messages.slice().reverse()" :key="index"
                :class="['d-flex flex-row align-center my-2',
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
                  <v-badge bordered bottom :color="getUserColor(msg.userId)" dot offset-x="4"
                    offset-y="10">
                    <v-avatar class="mt-n4 " size="32" elevation="2">
                      <img :src="getUserAvatar(msg.userId)"/>
                    </v-avatar>
                  </v-badge>
                </v-btn>
                <v-card class="mt-2 ml-2" max-width="450px" v-if="msg.userId
                  != currentUser.id" :key="index">   
                  <v-list-item>
                    <v-list-item-content class="other-message-container">
                      <v-list-item-title class="message-name">{{ getUserName(msg.userId) }}</v-list-item-title>
                      <div class="mb-2 message"> {{ msg.content }} </div>
                      <v-list-item-subtitle> {{ msg.date }} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card >
              </div>
            </div>

            <div v-if="currentChannel.messages.length === 0">
              <h1 class="Spotnik textfullcenter" data-text="Start conversation">Start conversation</h1>  
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
          <v-app v-else-if="currentChannel.id != '' && !currentChannel.member">
            <h1 class="Spotnik textfullcenter" data-text="Non member">You are not a member</h1>
          </v-app>

          <v-app v-else-if="currentChannel.id != ''">
            <h1 class="Spotnik textfullcenter" data-text="Loading messages">Loading messages</h1>
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
                  <img v-if="currentChannel.avatar" :src="currentChannel.avatar" width="70" height="70">
                  <v-icon v-else color="white">mdi-duck</v-icon>
                </v-avatar>
              </v-badge>
            </div>
            <div v-else>
              <v-avatar class="s" elevation="10" size="60px" color="blue">
                <img v-if="currentChannel.avatar" :src="currentChannel.avatar" width="70" height="70">
                <v-icon v-else color="white">mdi-duck</v-icon>
              </v-avatar>
            </div>
            <v-card-title class="layout justify-center">{{ currentChannel.name }}</v-card-title>
            <v-card-subtitle class="layout justify-center">{{ currentChannel.description }}</v-card-subtitle>
            
            <!-- CASE CHANNEL -->
            <div id="app" class="pt-6" v-if="currentChannel.type != ChannelType.PM"> 

              <!-- SUBCASE CHANNEL NOT JOINED -->
              <div v-if="!currentChannel.member">
                <v-btn elevation="2" width="100%" @click="joinChannel">
                  Join the chat room
                </v-btn>
                <modale :showPasswordModal="showPasswordModal" :toggleModal="toggleModal" @password="joinProtectedChannel"></modale>
              </div>

              <!-- SUBCASE CHANNEL JOINED -->
              <div v-else>
                <v-btn elevation="2" width="100%">
                  Leave the chat room
                </v-btn>
                <v-btn color="red" @click="leaveChannel" to="/">Logout</v-btn> // TODO logOut property doesn't exist ?
                
                <!-- OPTION FOR ADMINS -->
                <div v-if="currentChannel.role === Roles.ADMIN
                  || currentChannel.role === Roles.OWNER">
                  <v-btn :to="{ name: 'ChangeRoom' }" elevation="2" width="350px">
                    Room settings
                  </v-btn>
                </div>

                <!-- INFOS ABOUT CHANNEL USERS  -->
                <!-- <div id="app" class="pt-6">
                  <v-tabs fixed-tabs v-model="tab">
                    <v-tabs-slider color="rgb(0,0,255)"></v-tabs-slider>
                    <v-tab color="rgb(0,0,255)"
                      v-for="(item, index) in tabs_manager"
                      :class="{active: currentTab === index}"
                      @click="currentTab = index" :key="item">
                      {{ item.tabs }}
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-card flat>            
                      <div v-show="currentTab === 0">
                        <v-list> -->
                          <!-- NB : v-model="selectedItem" after v-list-item-group ? -->
                          <!-- <v-list-item-group>
                            <template v-for="(item, index) in members">

                              <v-subheader v-if="item.header" :key="item.header"
                                v-text="item.header">
                              </v-subheader>

                              <v-divider v-else-if="item.divider" :key="index"
                                :inset="item.inset">
                              </v-divider>
                        
                              <v-list-item v-else :key="item.title">

                                <div v-if="currentUser.role === Role.ADMIN 
                                  || currentUser.role === Role.OWNER">
                                  <v-btn :to="{ name: 'ManageUsers' }" icon
                                    v-bind="attrs" v-on="on" elevation="0">
                                    <v-app-bar-nav-icon elevation="0"></v-app-bar-nav-icon>
                                  </v-btn>
                                </div>

                                <v-btn elevation="0" min-height="50px" max-width="50px">
                                  <v-badge bordered bottom color="green" dot offset-x="6" offset-y="34" >
                                    <v-list-item-avatar>
                                      <v-img :src="item.photo" min-width="50px" min-height="50px"></v-img>
                                    </v-list-item-avatar>
                                  </v-badge>
                                </v-btn>
                                
                                <v-list-item-content>
                                  <v-list-item-title class="offsetmess">
                                    {{ item.title }}
                                  </v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>

                              <v-divider v-if="index < members.length" :key="index">
                              </v-divider>

                            </template>
                          </v-list-item-group>
                        </v-list>
                      </div>

                      <div v-show="currentTab === 1">
                        <v-list> -->
                          <!-- NB v-model="selectedItem" after v-list-item-group ? -->
                          <!-- <v-list-item-group>
                            <template v-for="(item, index) in admins">
                              <v-subheader v-if="item.header" :key="item.header" 
                                v-text="item.header">
                              </v-subheader>
                              <v-divider v-else-if="item.divider" :key="index"
                                :inset="item.inset">
                              </v-divider>
                              <v-list-item v-else :key="item.title">

                                <div v-if="user is admin">
                                  <v-btn :to="{ name: 'ManageUsers' }" icon v-bind="attrs"
                                    v-on="on" elevation="0">
                                    <v-app-bar-nav-icon elevation="0"></v-app-bar-nav-icon>
                                  </v-btn>
                                </div>
                              
                                <v-btn elevation="0" min-height="50px" max-width="50px" >
                                  <v-badge bordered bottom color="green" dot offset-x="6" offset-y="34" >
                                    <v-list-item-avatar>
                                      <v-img :src="item.photo" min-width="50px" min-height="50px"></v-img>
                                    </v-list-item-avatar>
                                  </v-badge>
                                </v-btn>
                                <v-list-item-content>
                                  <v-list-item-title class="offsetmess">{{item.title}}</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-divider v-if="index < admins.length" :key="index">
                              </v-divider>
                            </template>
                          </v-list-item-group>
                        </v-list>
                      </div>
                    </v-card>
                  </v-tabs-items>
                </div>-->
              </div>
            </div>

            <!-- CASE PRIVATE MESSAGE -->
            <div id="app" v-else>
              <v-app id="inspire" class="pt-6">
                <v-btn v-on:click="blockAlert" elevation="2" width="350px">
                  Block this user
                </v-btn>
                <v-scale-transition>
                  <div v-if="!loading" class="text-center">
                    <v-btn color="rgb(0,0,255)" @click="loading = true" elevation="2" width="350px">
                      <div  :style="{color: ' #ffffff'}">
                        Invite to play together
                      </div>
                    </v-btn>
                  </div>
                </v-scale-transition>
                <v-toolbar dense  color="rgba(0,0,0,0)">
                  <v-progress-linear :active="loading"
                    :indeterminate="loading" absolute bottom
                    color="rgb(0,0,255)">
                  </v-progress-linear>
                </v-toolbar>
              </v-app>
            </div>

          </v-card>  
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
import TheModale from "./Chat_modale.vue";
import { onBeforeRouteLeave } from 'vue-router';
import { leaveChat } from '../helper';
import { Status, Message, UserChannel, Channel, ChannelType,
  Roles } from '../types/chat.types';
import { getAvatarID } from '../components/FetchFunctions';


export default defineComponent({
  name: "ChatMain",
  components: {
    'modale': TheModale
  },
  //data() {
  //  return {
      // chat_channel_isAdmin - variable that made to check if the user is admin of current chat
      // accordind to this info we change the interface
      // for the moment we change the value manualy, but we should get it from backend
      
      //chat_channel_isAdmin: true as boolean,
      // chat_person is indicator that now user communicate not with a channel, but with another user
      // accordind to this info we change the interface
      // for the moment we change the value manualy, but we should get it from backend

      //chat_person: false as boolean,
      //revele: false,
      //fav: true as boolean,
      //menu: false as boolean,
      //currentTab: 0 as number,
      //loading: false as boolean,
      //tab: null as null | any,

      //tabs_manager: [
      //  {tabs: 'Members',},
      //  {tabs: 'Administrators',}
      //] as any,

      // members and admins are here only as an example of the design:
      // they dont content the read data. The real data we will receive
      // from backend ib the dame format (list of dictionaries (each channel has its dictionary))
      
      //members: [
      //{   
      //  photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
      //  title: "abaudot",
      //},
      //] as any,
      //admins: [
      //{   
      //  photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
      //  title: "abaudot",
      //},
      //] as any,
      // txt is a variable made to save CURRENT message that user is GOING TO send
      // with this we will emit this data to backend

      //userBanned: false,
      //userMuted: false,
      //banDate: new Date,
      //muteDate: new Date,
      // Not - used vars that we can need
      // Comment for Aimé: what was the idea ?

      //newChannel: {
      //  name:'',
      //  public: true,
      //  password: '',
      //  members: [],
      //  admins: [],
      //  },

      // Not - used vars that we can need
      // Comment for Aimé: this one we realy need, but now we just can know 
      // if the channel is public ot not

      //protectByPassword: false,
      //channelSettings: {
      //  password: '',
      //  applyPassword: false,
      //  members: [],
      //},
  //  }
  //},
  //methods: {
  //  // blockAlert activated after pushing button "Block this user"
  //  // its, of course, temporary solution cause we need to clock for real
  //  // when user block another user - he cant see the messages anymore
  //  blockAlert: function (event : any)
  //  {
  //    if (event) 
  //    {
  //      alert("WE NEED TO BLOCK THIS USER")
  //    }
  //  },
  //},
  // this is needed to limit (3000 ms) loading process after pushing bitton "Invite to play togetrer"
  // made show on template the animation "while waiting"
  //watch: {
  //  loading (val: number) {
  //    if (!val) return
  //    setTimeout(() => (this.loading = false), 3000)
  //  },
  //},
	setup() {
		const connection = ref<null | any>(null);
    const store = useStore() as Store<any>;
    const currentUser = useStore().getters.whoAmI as any;
    let usersList = ref<any>(null);
    let userChannels = ref({ channels: [] as any[] });
    let update = ref({ connected: false as boolean, users: false as boolean,
      messages: false as boolean });
    let currentChannel = ref({ name: '' as string, id: '' as string,
      type: ChannelType.PUBLIC as ChannelType, member: false as boolean,
      messages: [] as Message[], users: [] as UserChannel[],
      role: Roles.USER as Roles, avatar: null as null | string,
      notif: false as boolean, description: '' as string});
    let messageText = ref<string>('');
    let searchRequest = ref<string>('');
    let joinableChannels = ref({ channels: [] as any[] });
    let showPasswordModal = ref<boolean>(false); // TODO set to true when click on join a protected channel

		onMounted(async() => {
			try {
        connection.value = store.getters.getSocketVal;
        if (connection.value === null) {
          connection.value = io(window.location.protocol + '//' + window.location.hostname + ':3000/chat',{
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
          console.log('here');
          connection.value!.emit('emitMyChannels');
        }
      })

      connection.value!.on('channelList', function(params: Channel[]) {
        console.log('list of joined channels received');
        console.log(params);
        userChannels.value.channels = params;
        avatarToUrl();
        update.value.connected = true;
      })

      connection.value!.on('joinableChannel', function(params: Channel[]) {
        console.log('!!!!!!!!>>>>>>' + params);
        joinableChannels.value.channels = params;
      })

      connection.value!.on('channelUsers', async function(params: { id: string, users: any[] }) {
        if (!currentChannel.value || params.id != currentChannel.value.id) {
          console.log('error of channel correspondance inside channelUsers ' + params.id + ' vs '+ currentChannel.value.id);
          return;
        }
        console.log('receive users from channel ' + currentChannel.value.name);
        currentChannel.value.users = params.users;
        await currentUserRole();
        update.value.users = true;
      })

      connection.value!.on('channelMessages', function(params: { id: string, messages: Message[] }) {
        if (params.id != currentChannel.value.id) {
          console.log('error of channel correspondance inside channelMessages ' + params.id + ' vs '+ currentChannel.value.id);
          return;
        }
        console.log('receive messages from channel ' + currentChannel.value.name);
        currentChannel.value.messages = params.messages;
        update.value.messages = true;
      })

      connection.value!.on('newMessage', function(params: {id: string, message: Message }) {
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
		})

		onBeforeRouteLeave(function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next, store);
    })

    function displayChannel(channel: any) {
      currentChannel.value.name = channel.name;
      currentChannel.value.id = channel.id;
      currentChannel.value.avatar = channel.avatar;
      currentChannel.value.notif = false;
      currentChannel.value.member = true;
      currentChannel.value.type = channel.type;
      if (channel.type === ChannelType.PUBLIC) {
        currentChannel.value.description = 'Public Channel';
      } else if (channel.type === ChannelType.PRIVATE) {
        currentChannel.value.description = 'Private Channel';
      } else if (channel.type === ChannelType.PROTECTED) {
        currentChannel.value.description = 'Protected Channel';
      } else {
        currentChannel.value.description = 'Private Conversation';
      }
      console.log('ask for ' + channel.name + ' users and messages');
      update.value.messages = false;
      update.value.users = false;
      connection.value.emit('getChannelUsers', { id: channel.id });
      connection.value.emit('getChannelMessages', { id: channel.id });
    }

    function getUserName(userId: number) {
      if (usersList.value === null) {
        console.log('Error when retrieving users');
        return;
      }
      for (let user of usersList.value) {
        if (user.id === userId) {
          return user.name;
        }
      }
      console.log('Something went wrong: User id ' + userId + ' not found in channel ' + currentChannel.value.name);
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

		function sendingMessage(channelId: string) {
      if (!messageText.value || messageText.value === '')
        return ;
      connection.value.emit('message', {'channelId': channelId, 'content': messageText.value });
      messageText.value = '';
    }

    function sendingSearchRequest() 
    {
      console.log(">>>>>>" + searchRequest.value + "<<<<<<<")
      if (!searchRequest.value || searchRequest.value === '')
        return ;
      connection.value.emit('getJoinnableChannels', searchRequest.value);
      searchRequest.value = '';
    }

    function currentUserRole() {
      for (let user of currentChannel.value.users) {
        if (user.id === currentUser.id) {
          currentChannel.value.role = user.role;
        }
      }
    }

    function avatarToUrl() {
      console.log('TO URL');
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

    function toggleModal() {
      showPasswordModal.value = !(showPasswordModal.value);
    }

    function joinChannel() {
      console.log('join channel');
      if (currentChannel.value.type === ChannelType.PROTECTED) {
        console.log('here');
        showPasswordModal.value = true;
        return ;
      }
      //TODO emit to back to join channel
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

      // function joinChannel(id)
      // {
      //   store.commit('setChannelJoinedStatus' , true);
      //   connection.value.emit('joinChannel', id);
      // }

      // function leaveChannel(id)
      // {
      //   store.commit('setChannelJoinedStatus' , false);
      //   connection.value.emit('leaveChannel', id);
      // }
        
      //function getPassToJoin() {
        // this function is for protected channels (see the specification)
        // as a parameter we will reseve info about the channel, our goal is to chack the password
        // for now it will just open modal window
      //}

      // 		// for bloking or unblocking  a user:
      // 		// - blockUser{ user: User, block: boolean } // true => block false => unblock
      // 		function blockUser(user, block)
      // 		{
      // 			console.log("before blockUser");
      // 			connection.value.emit('blockUser', user, block);
      // 			console.log("after blockUser");
      // 		}

		return { update, messageText, userChannels, displayChannel,
      currentChannel, currentUser, getUserName, getUserAvatar, getUserStatus,
      getUserColor, sendingMessage, currentUserRole, sendingSearchRequest,
      searchRequest, joinableChannels, avatarToUrl, log, isScrollAtBottom,
      ChannelType, toggleModal, showPasswordModal, joinChannel, 
      joinProtectedChannel, Roles }
	},
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

.messagefield{
  width:100%;
  /* position: absolute; */
  /* bottom: 0px; */
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
