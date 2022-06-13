<template>
  <v-app >
    <v-container fluid v-if="connected">
      <v-row>

        <!-- ELEMENTS ON LEFT OF SCREEN -->
        <v-col cols="auto" sm="3" class="border">
          <v-col>
          <!-- NB! When serach field will work on backen - add onclick option calling method  -->
            <!-- SEARCH CHANNEL/USER -->
            <div class="d-flex">
              <v-text-field clearable label="Find user / group"
              placeholder="Search" height = "50px"></v-text-field>
              <!-- <v-btn  height="54px" @click="log"><v-icon right dark>mdi-magnify</v-icon></v-btn> -->
            </div>
            <!-- CREATE NEW ROOM BUTTON -->
            <v-btn :to="{ name: 'NewRoom' }" elevation="2" width="100%">
              Create chat room
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn>
          </v-col>
          <!-- LIST OF CHANNELS JOINED -->
          <div id="app" class="text-left">
            <v-app id="inspire">
              <v-list>
              <!-- NB! We can create v-model="selectedItem" so when channel is open its color changed
              (for now we dont do this cause there are more important stuff to finish) -->
               <v-list-item-group  > 
                <template v-for="(item, index) in userChannels">
                  <v-subheader v-if="item.header" :key="item.header"
                  v-text="item.header"></v-subheader>
                  <v-divider v-else-if="item.divider" :key="index"
                  :inset="item.inset"></v-divider>
                  <v-list-item v-else :key="item.title">
                  <v-btn elevation="0" min-height="50px"  max-width="50px">
                    <v-badge bordered bottom color="green" dot offset-x="6" offset-y="34" >
                      <v-list-item-avatar >
                       <v-img :src="item.avatar"  min-width="50px" min-height="50px"></v-img>
                      </v-list-item-avatar>
                    </v-badge>
                  </v-btn>
              <v-list-item-title class="offsetmess">{{item.title}}</v-list-item-title>
            </v-list-item>
                <v-divider
                  v-if="index < getChannels.length"
                  :key="index"
                ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        </v-app>
        </div>
        </v-col>



		<!-- open channel / example display -->
        <v-col cols="auto" sm="6" class="border">
        <div id="app">

          <v-app id="inspire">

            <!-- NB! get the real message -->
            <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom messagefield">
              <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
                <v-avatar class="mt-n4 " size="32" elevation="2">
                      <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
                </v-avatar>
              </v-badge>
              </v-btn>
            <v-card class="mt-2 ml-2" max-width="450px">
              <v-list-item >
                <v-list-item-content>
                  <div class="mb-2">
                    It's funny, to know hows websockets works
                  </div>
                  <v-list-item-subtitle> 19:45 </v-list-item-subtitle>  
                </v-list-item-content>
              </v-list-item>
            </v-card >
          </v-toolbar>

          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom messagefield">
            <v-spacer></v-spacer>
            <v-card class="mt-2 mr-2" max-width="450px" color="rgb(0,0,255)"  dark>
              <v-list-item >
                <v-list-item-content>
                  <div  :style="{color: ' #ffffff'}" class="mb-2">
                    Yeah, a lot of syntaxic sugar
                  </div>
                  <v-list-item-subtitle :style="{color: ' #ffffff'}"> 19:46 </v-list-item-subtitle>  
                </v-list-item-content>
              </v-list-item>
            </v-card >
            <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
              <v-avatar class="mt-n4 " size="32" elevation="2">
                    <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
              </v-avatar>
              </v-badge>
            </v-btn>
          </v-toolbar>

          <!-- <v-toolbar dense  color="rgba(0,0,0,0)" class="spacetop"> -->
          <div class="d-flex">
            <v-text-field
              clearable
              class="messagefield"
              width="100%"
              label="Write a message"
              placeholder="Message"
              @keyup.enter="sendingMessage(this.txt, this.currentChannel)"
              v-model="txt"
            ></v-text-field>
            <!-- button bellow is from old design, I save it just in case -->
            <!-- <v-btn height="54px" color="rgb(0,0,255)" class="spacetop" @click="sendingMessage(this.txt, this.currentChannel)"> // TODO this.values may be undefined ?
              <div  :style="{color: ' #ffffff'}">
                send
              </div>
            </v-btn> -->
          </div>
        </v-app>
        </div>
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
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
import { useStore, Store } from "vuex";
import { defineComponent } from 'vue'
import TheModale from "./Chat_modale.vue";
import { onBeforeRouteLeave } from 'vue-router';
import leaveChat from '../helper';


export default defineComponent({
  name: "ChatMain",
  components: {
    'modale': TheModale
  },
  data: () => ({
      // chat_channel_isAdmin - variable that made to check if the user is admin of current chat
      // accordind to this info we change the interface
      // for the moment we change the value manualy, but we should get it from backend
      chat_channel_isAdmin: true as boolean,
      // chat_person is indicator that now user communicate not with a channel, but with another user
      // accordind to this info we change the interface
      // for the moment we change the value manualy, but we should get it from backend
      chat_person: false as boolean,
      revele: false,
      fav: true as boolean,
      menu: false as boolean,
      currentTab: 0 as number,
      loading: false as boolean,
      tab: null as null | any,

      tabs_manager: [
        {tabs: 'Members',},
        {tabs: 'Administrators',}
      ] as any,
      // members and admins are here only as an example of the design:
      // they dont content the read data. The real data we will receive
      // from backend ib the dame format (list of dictionaries (each channel has its dictionary))
      members: [
      {   
        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
        title: "abaudot",
      },
      ] as any,
      admins: [
      {   
        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
        title: "abaudot",
      },
      ] as any,
      // txt is a variable made to save CURRENT message that user is GOING TO send
      // with this we will emit this data to backend
      txt: '',
      // Comment for Aimé: Remind me why do you need it, pls ? :)
      currentUser: useStore().getters.whoAmI,
      // Not - used vars that we can need
      // Comment for Aimé: we will still use it ? Or we will take info from storage ? Cause now this data is empty.
      /*
      currentChannel: {
        id: '',
        chanName: '',
        date: new Date,
        update_date: new Date,
        owner: 0,
        publicChannel: true,
        password: '',
        users: [],
        adminUsers: [],
        joinChannel: [],
        messages: []
      },
      */ //aime response: for now not in use...
      // Not used vars that we can need
      // Comment for Aimé: seems like this info is for administrators
      // On what key-word can we get this data from backend ?
      userBanned: false,
      userMuted: false,
      banDate: new Date,
      muteDate: new Date,
      // Not - used vars that we can need
      // Comment for Aimé: what was the idea ?
      newChannel: {
        name:'',
        public: true,
        password: '',
        members: [],
        admins: [],
        },
      // Not - used vars that we can need
      // Comment for Aimé: this one we realy need, but now we just can know 
      // if the channel is public ot not
      protectByPassword: false,
      channelSettings: {
        password: '',
        applyPassword: false,
        members: [],
      },
  }),

  methods: {
    toggleModale: function() {
      this.revele = !this.revele;
    },
    // blockAlert activated after pushing button "Block this user"
    // its, of course, temporary solution cause we need to clock for real
    // when user block another user - he cant see the messages anymore
    blockAlert: function (event : any) // TODO check event tupe 
    {
      if (event) 
      {
        alert("WE NEED TO BLOCK THIS USER")
      }
    },
  },

  // this is needed to limit (3000 ms) loading process after pushing bitton "Invite to play togetrer"
  // made show on template the animation "while waiting"
  watch: {
    loading (val: number) {
      if (!val) return
      setTimeout(() => (this.loading = false), 3000)
    },
  },

	setup() {
		const connection = ref<null | any>(null);
    const store = useStore() as Store<any>;
    let getChannels = store.getters.getChannels as any[];
    let isChannelJoined = store.getters.isChannelJoined as boolean;
    const connected = ref<boolean>(false);
    let userChannels = [] as any[];


		onMounted(() =>{
			console.log(document.cookie.toString());
			try {
				connection.value = io('http://:3000/chat',{
          transportOptions: {
            polling: { extraHeaders: { auth: document.cookie} },
          },
				})
				console.log("starting connection to websocket")
        store.commit('setSocketVal' , connection.value);
			} catch (error) {
				console.log("the error is:" + error)
			}

      connection.value!.on('connectedToChat', function() {
        connected.value = true;
        console.log('connectedToChat: ' + connected.value);
        connection.value!.emit('emitMyChannels');
      })

      connection.value!.on('channelList', function(params: any) { //May be subject to modification
        userChannels = params;
        console.log('Params :' + params);
        void userChannels;
      })

		})

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
        
      function getPassToJoin()
      {
        // this function is for protected channels (see the specification)
        // as a parameter we will reseve info about the channel, our goal is to chack the password
        // for now it will just open modal window
      }

      // 		// for bloking or unblocking  a user:
      // 		// - blockUser{ user: User, block: boolean } // true => block false => unblock
      // 		function blockUser(user, block)
      // 		{
      // 			console.log("before blockUser");
      // 			connection.value.emit('blockUser', user, block);
      // 			console.log("after blockUser");
      // 		}


      // NB! needed to be done to disconnect from the socket when we completely leave the chat
      // onBeforeRouteLeave(() => {
      //     const answer = window.confirm("disconect from chat ?")
      //     if (answer) {
      //       connection.value.disconnect();
      //       return true;
      //       }
      //     return false;
      // })

		function sendingMessage(content: string, channel: any) // TODO check type
		{
      // NB! Need to be done
      console.log(content, channel);
      if (!content)
        return ;
      connection.value.emit('message', {content, channel});
		}

		onBeforeRouteLeave( function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next);
    })

		return { sendingMessage, getChannels, isChannelJoined, getPassToJoin, connected, userChannels }

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

.messagefield{
  width:100%;
  /* position: absolute; */
  /* bottom: 0px; */
}

</style>
