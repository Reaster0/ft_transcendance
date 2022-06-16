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
            <div class="d-flex">
              <v-text-field clearable label="Find user or group to chat"
              placeholder="Search" height = "50px"></v-text-field>
            </div>

            <!-- CREATE NEW ROOM BUTTON -->
            <v-btn :to="{ name: 'NewRoom' }" elevation="2" width="100%">
              Create chat room
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn>

          </v-col>

          <!-- LIST OF CHANNELS JOINED -->
          <div class="text-left">
            <v-app>
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
                          <v-img v-if="item.avatar != null" src="item.avatar"
                            min-width="50px" min-height="50px"></v-img>
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
                          <v-img src="item.avatar" min-width="50px"
                            min-height="50px"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-avatar v-else>
                          <v-avatar color="blue" min-width="50px"
                            min-height="50px">
                            <v-icon color="white">mdi-duck</v-icon>
                          </v-avatar>
                        </v-list-item-avatar>
                      </v-badge>
                    </v-btn>
                    <v-list-item-title class="offsetmess">{{ item.channelName }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider v-if="index < userChannels.channels.length"
                    :key="index"></v-divider>
                </template>
                </v-list-item-group>
              </v-list>
            </v-app>
          </div>
        </v-col>

        <!-- ELEMENT ON CENTER OF SCREEN / CHANNEL DISPLAY -->
        <v-col cols="auto" sm="6" class="border">
          <v-app id="chatdisplay" v-if="update.messages && update.users
            && currentChannel.name != ''" style="max-height: 600px;">

            <!-- MESSAGES DISPLAY -->
            <!--<div id="chatdisplay">-->
            <div class="specialscroll">
              <div v-for="(msg, index) in currentChannel.messages.slice().reverse()" :key="index"
                :class="['d-flex flex-row align-center my-2',
                msg.creatorId == currentUser.id ? 'justify-end': null]">
                <v-card class="d-flex-column" max-width="450px"
                  v-if="msg.creatorId === currentUser.id" :key="index"
                  color="rgb(0,0,255)" dark>
                  <v-list-item>
                    <v-list-item-content>
                      <div class="mb-2" :style="{color: ' #ffffff'}">
                        {{ msg.content }} </div>
                      <v-list-item-subtitle :style="{color: ' #ffffff'}">
                        {{ msg.date }} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
                <v-btn elevation="0" min-height="50px"
                  max-width="50px">
                  <v-badge bordered bottom :color="getUserColor(msg.creatorId)" dot offset-x="4"
                    offset-y="10">
                    <v-avatar class="mt-n4 " size="32" elevation="2">
                      <img :src="'/users/getAvatarByAvatarId' + msg.creatorId" />
                    </v-avatar>
                  </v-badge>
                </v-btn>
                <v-card class="mt-2 ml-2" max-width="450px" v-if="msg.creatorId
                  != currentUser.id" :key="index">   
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title :style="{color: 'grey'}">{{ getUserName(msg.creatorId) }}</v-list-item-title>
                      <div class="mb-2"> {{ msg.content }} </div>
                      <v-list-item-subtitle> {{ msg.date }} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card >
              </div>
            </div>

                      <!-- SEND MESSAGE -->
            <div class="d-flex" overflow-hidden>
              <v-text-field clearable class="messagefield" width="100%" 
                label="Write a message" placeholder="Message"
                @keyup.enter="sendingMessage(txt, currentChannel)" v-model="txt">
              </v-text-field>
            </div>

          <!-- LOADING / NON SELECTED MESSAGES -->
          </v-app>
          <v-app v-else-if="currentChannel.name != ''">
            <h1 class="Spotnik text-center" data-text="Loading messages">Loading messages</h1>
          </v-app>
          <v-app v-else>
            <h1 class="Spotnik text-center" data-text="Select">Select channel to display</h1>
          </v-app>
        </v-col>




		<!-- info group / person -->
		<v-col cols="auto" sm="3" class="border">
      <div v-if="!chat_channel_isAdmin && !chat_person">
        <v-card height="100%" class="text-center offsetphoto" shaped >
            <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
                  <v-avatar class="s" elevation="10" size="60px">
                    <img src="http://ic.pics.livejournal.com/alexpobezinsky/34184740/751173/751173_original.jpg" width="70" height="70">
                  </v-avatar>
            </v-badge>
              <v-card-title class="layout justify-center">Equipe transcendance</v-card-title>
              <v-card-subtitle class="layout justify-center">The best team</v-card-subtitle>
        <div id="app" class="pt-6"> 
        <!-- NB! Activate scenario "joinChannel" with MODAL WINDOW for PROTECTED on clink ! (how to get info about exact channel ? ) -->
        <!-- NB! This we will uncomment when we will have identificator to TYPE or channels,
        cause this condition is for PROTECTED (<div v-if="!isChannelJoined" && PROTECTED ID>) -->
        <modale :revele="revele" :toggleModale="toggleModale"></modale>
        <!-- <div v-if="!isChannelJoined">
          <v-btn v-on:click="toggleModale" class="btn btn-success" elevation="2" width="100%">Join the chat room </v-btn>
        </div> -->
        <!-- NB! Activate scenario "joinChannel" in "getPassToJoin" on clink for PRIVATE and PUBLIC! 
        (how to get info about exact channel ? ) -->
				<v-btn v-if="!isChannelJoined" elevation="2" width="100%" @click="getPassToJoin">
					Join the chat room
				</v-btn>
				<div v-else>
					<v-btn elevation="2" width="100%">
						Leave the chat room
					</v-btn>
					<v-btn color="red" @click="logOut" to="/">Logout</v-btn> // TODO logOut property doesn't exist ?
				</div>
        </div>

      <!-- end of example display-->        

        
        <!-- TABS  -->
        <div id="app" class="pt-6">
          <v-tabs
            fixed-tabs
            v-model="tab"
          >
            <v-tabs-slider color="rgb(0,0,255)"></v-tabs-slider>
            <v-tab
              color="rgb(0,0,255)"
              v-for="(item, index) in tabs_manager"
              :class="{active: currentTab === index}"
              @click="currentTab = index"
              :key="item"
            >
              {{ item.tabs }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-card flat>            
              <div v-show="currentTab === 0">
                <!-- <v-list>
                  <v-list-item-group v-model="selectedItem" >
                    <template v-for="(item, index) in members">
                    <v-subheader v-if="item.header" :key="item.header" v-text="item.header"
                    ></v-subheader>
                    <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"
                    ></v-divider>
                
                    <v-list-item
                      v-else
                      :key="item.title"
                    >

                      <v-btn elevation="0" min-height="50px" max-width="50px">
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
                      <v-divider
                        v-if="index < members.length"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list> -->
              </div>
              <div v-show="currentTab === 1">
                <!-- <v-list>
                  <v-list-item-group v-model="selectedItem" >
                    <template v-for="(item, index) in admins">
                    <v-subheader v-if="item.header" :key="item.header" v-text="item.header"
                    ></v-subheader>
                    <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"
                    ></v-divider>
                
                    <v-list-item
                      v-else
                      :key="item.title"
                    >
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
                      <v-divider
                        v-if="index < admins.length"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list> -->
              </div>
            </v-card>
          </v-tabs-items>
          </div>
        </v-card>
      </div>
      <div v-if="chat_channel_isAdmin && !chat_person">
        <v-card height="100%" class="text-center offsetphoto" shaped >
          <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
                <v-avatar class="s" elevation="10" size="60px">
                  <img src="http://ic.pics.livejournal.com/alexpobezinsky/34184740/751173/751173_original.jpg" width="70" height="70">
                </v-avatar>
          </v-badge>
            <v-card-title class="layout justify-center">Equipe transcendance</v-card-title>
            <v-card-subtitle class="layout justify-center">The best team</v-card-subtitle>
      

          <div id="app" class="pt-6">
          <v-btn v-on:click="create" elevation="2" width="350px" color="red">
            Leave the chat room
          </v-btn>
          </div>
          <div id="app">
          <v-btn :to="{ name: 'ChangeRoom' }" elevation="2" width="350px">
            Room settings
          </v-btn>
          </div>

      
        <!-- TABS  -->
        <div id="app" class="pt-6">
          <v-tabs
            fixed-tabs
            v-model="tab"
          >
            <v-tabs-slider color="rgb(0,0,255)"></v-tabs-slider>
            <v-tab
              color="rgb(0,0,255)"
              v-for="(item, index) in tabs_manager"
              :class="{active: currentTab === index}"
              @click="currentTab = index"
              :key="item"
            >
              {{ item.tabs }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-card flat>            
              <div v-show="currentTab === 0">
                <v-list>
                  <!-- <v-list-item-group v-model="selectedItem" > -->
                  <v-list-item-group >
                    <template v-for="(item, index) in members">
                    <v-subheader v-if="item.header" :key="item.header" v-text="item.header"
                    ></v-subheader>
                    <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"
                    ></v-divider>
                
                    <v-list-item
                      v-else
                      :key="item.title"
                    >
                      <v-btn :to="{ name: 'ManageUsers' }"
                        icon
                        v-bind="attrs"
                        v-on="on" 
                        elevation="0"
                      > // TODO attrs and on doesn't exist ?
                        <v-app-bar-nav-icon elevation="0"></v-app-bar-nav-icon>
                      </v-btn>

                      <v-btn elevation="0" min-height="50px" max-width="50px">
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
                      <v-divider
                        v-if="index < members.length"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list>
              </div>
              <div v-show="currentTab === 1">
                <v-list>
                  <!-- <v-list-item-group v-model="selectedItem" > -->
                    <v-list-item-group>
                    <template v-for="(item, index) in admins">
                    <v-subheader v-if="item.header" :key="item.header" v-text="item.header"
                    ></v-subheader>
                    <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"
                    ></v-divider>
                
                    <v-list-item
                      v-else
                      :key="item.title"
                    >
                      <v-btn :to="{ name: 'ManageUsers' }"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        elevation="0"
                      > // TODO attrs and on doesn't exist ?
                        <v-app-bar-nav-icon elevation="0"></v-app-bar-nav-icon>
                      </v-btn>
                      
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
                      <v-divider
                        v-if="index < admins.length"
                        :key="index"
                      ></v-divider>
                    </template>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-card>
          </v-tabs-items>
        </div>
        </v-card>
      </div>
      <div v-else>
         <v-card height="100%" class="text-center offsetphoto" shaped >
             <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
                   <v-avatar class="s" elevation="10" size="60px">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Wildlife_at_Maasai_Mara_%28Lion%29.jpg/1200px-Wildlife_at_Maasai_Mara_%28Lion%29.jpg" width="70" height="70">
                    </v-avatar>
             </v-badge>
                <v-card-title class="layout justify-center">anadege</v-card-title>
                <v-card-subtitle class="layout justify-center">Teammate</v-card-subtitle>
          
      
      <div id="app">
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
            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              absolute
              bottom
              color="rgb(0,0,255)"
            ></v-progress-linear>
          </v-toolbar>
        </v-app>
      </div>
      </v-card>
      </div>

  
        </v-col>
        
      </v-row>

    </v-container>
    <v-container fluid v-else>
			<h1 class="Spotnik text-center" data-text="Loading">Loading</h1>
    </v-container>
    <!--<v-container fluid v-else>
      <h1>Loading...</h1>
    </v-container>-->

  </v-app>
</template>

<script lang="ts">
/*
document.getElementByClass(dans une div, tous la meme classe/ nom de classe).scrollTo(0, document.getElementByClass()) = 
*/
import { onMounted } from "@vue/runtime-core"
import io from 'socket.io-client';
import { useStore, Store } from "vuex";
import { ref, defineComponent, reactive } from 'vue'
import TheModale from "./Chat_modale.vue";
import { onBeforeRouteLeave } from 'vue-router';
import leaveChat from '../helper';
import { Message, User } from '../types/chat.types';

export default defineComponent({
  name: "ChatMain",
  components: {
    'modale': TheModale
  },
  data: () => ({
      // chat_channel_isAdmin - variable that made to check if the user is admin of current chat
      // accordind to this info we change the interface
      // for the moment we change the value manualy, but we should get it from backend
      
      //chat_channel_isAdmin: true as boolean,
      // chat_person is indicator that now user communicate not with a channel, but with another user
      // accordind to this info we change the interface
      // for the moment we change the value manualy, but we should get it from backend

      //chat_person: false as boolean,
      revele: false,
      //fav: true as boolean,
      //menu: false as boolean,
      //currentTab: 0 as number,
      loading: false as boolean,
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

      //txt: '',
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
  }),
  //methods: {
  //  toggleModale: function() {
  //    this.revele = !this.revele;
  //  },
  //  // blockAlert activated after pushing button "Block this user"
  //  // its, of course, temporary solution cause we need to clock for real
  //  // when user block another user - he cant see the messages anymore
  //  blockAlert: function (event : any) // TODO check event tupe 
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
    let isChannelJoined = store.getters.isChannelJoined as boolean;
    let userChannels = reactive({ channels: [] as any[] });
    let update = reactive({ connected: false as boolean, users: false as boolean,
      messages: false as boolean });
    let currentChannel = reactive({ name: '' as string, id: '' as string,
      messages: [] as Message[], users: [] as User[] });
    //let txt = ref<string>('');

		onMounted(async() => {
      console.log('render');
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
          update.connected = true;
          connection.value!.emit('emitMyChannels');
        }
			} catch (error) {
				console.log("the error is:" + error)
			}

      connection.value!.on('usersList', function(params: any) {
        console.log('receive new users list');
        store.commit('setUsersList', params);
        if (!update.connected) {
          connection.value!.emit('emitMyChannels');
        }
      })

      connection.value!.on('channelList', function(params: any) {
        console.log('list of joined channels received');
        userChannels.channels = params;
        update.connected = true;
      })

      connection.value!.on('channelUsers', function(params: { id: string, users: any[] }) {
        if (params.id != currentChannel.id) {
          console.log('error of channel correspondance inside channelUsers');
        }
        console.log('receive users from channel ' + currentChannel.name);
        currentChannel.users = params.users;
        currentChannel.users = [{ id: 1, name: 'User1', role: 'admin', status:'ONLINE', avatar:'http://ic.pics.livejournal.com/alexpobezinsky/34184740/751173/751173_original.jpg'},
        { id: 2, name: 'User2', role: '', status:'OFFLINE', avatar:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Wildlife_at_Maasai_Mara_%28Lion%29.jpg/1200px-Wildlife_at_Maasai_Mara_%28Lion%29.jpg'}];
        update.users = true;
        //console.log(params.users);
      })

      connection.value!.on('channelMessages', function(params: { id: string, messages: any[] }) {
        if (params.id != currentChannel.id) {
          console.log('Error of channel correspondance inside channelMessages');
        }
        console.log('receive messages from channel ' + currentChannel.name);
        //currentChannel.messages = params.messages;
        currentChannel.messages = [{ content: 'Hello', creatorId: 1, date: '19:45'}, { content: 'How are you ?', creatorId: 2, date: '12:38'}, {content : 'Fine and you ?', creatorId: 1, date: '14:12'},
        { content: 'Hello', creatorId: 1, date: '19:45'}, { content: 'How are you ?', creatorId: 2, date: '12:38'}, {content : 'Fine and you ?', creatorId: 1, date: '14:12'},
        { content: 'Hello', creatorId: 1, date: '19:45'}, { content: 'How are you ?', creatorId: 2, date: '12:38'}, {content : 'Fine and you ?', creatorId: 1, date: '14:12'},
        { content: 'Hello', creatorId: 1, date: '19:45'}, { content: 'How are you ?', creatorId: 2, date: '12:38'}, {content : 'Fine and you ?', creatorId: 1, date: '14:12'}];
        update.messages = true;
        //console.log(params.messages);
      })
		})

		onBeforeRouteLeave( function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next, store);
    })

    function displayChannel(channel: any) {
      currentChannel.name = channel.channelName;
      currentChannel.id = channel.id;
      console.log('ask for ' + channel.channelName + ' users and messages');
      update.messages = false;
      update.users = false;
      connection.value.emit('getChannelUsers', { id: channel.id });
      //connection.value.emit('getChannelMessages', { id: channel.id });
    }

    function getUserName(userId: number) {
      if (!store.getters.getUsersList) {
        console.log('Error when retrieving users');
        return;
      }
      for (let user of store.getters.getUsersList) {
        if (user.id === userId) {
          return user.name;
        }
      }
      console.log('Something went wrong: User id ' + userId + ' not found in channel ' + currentChannel.name);
    }

    function getUserAvatar(userId: number) {
      if (!store.getters.getUsersList) {
        console.log('Error when retrieving users');
        return;
      }
      for (let user of store.getters.getUsersList) {
        if (user.id === userId) {
          return user.avatar;
        }
      }
      console.log('Something went wrong: User id ' + userId + ' not found');
    }
    
    function getUserStatus(userId: number) {
      if (!store.getters.getUsersList) {
        console.log('Error when retrieving user avatar');
        return;
      }
      for (let user of store.getters.getUsersList) {
        if (user.id === userId) {
          return user.status;
        }
      }
      console.log('Something went wrong: User id ' + userId + ' not found');
    }

    function getUserColor(userId: number) {
      const status = getUserStatus(userId);
      if (status === 'online')
        return "green";
      else if (status === 'playing')
        return "yellow";
      return "grey";
    }

		function sendingMessage(content: string, channel: any) {
      // NB! Need to be done
      console.log(content, channel);
      if (!content)
        return ;
      connection.value.emit('message', {content, channel});
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

		return { sendingMessage, isChannelJoined, update, 
      userChannels, displayChannel, currentChannel, currentUser, getUserName,
      getUserAvatar, getUserStatus, getUserColor }

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

.specialscroll {
  overflow: auto;
  display: flex;
  flex-direction:column-reverse;
}

</style>
