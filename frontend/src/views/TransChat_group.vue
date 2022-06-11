<template>
  <v-app >
    <v-container fluid >
      <v-row >

      <v-col cols="auto" sm="3" class="border">
			<v-col>
      <!-- NB! When serach field will work on backen - add onclick option calling method  -->
      <div class="d-flex textcont">
        <v-text-field
          clearable
          label="Find user / group"
          placeholder="Search"
          height = "50px"
        ></v-text-field>
         <!-- <v-btn  height="54px" @click="log"><v-icon right dark>mdi-magnify</v-icon></v-btn> // TODO proprierty log doesn't exist ? -->
    </div>
      <v-btn to="/newroom" elevation="2" width="100%">
				Create new chat room
				<v-divider class="mx-2" vertical></v-divider>
				<v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
			</v-btn>
      <v-overlay :value="overlay"></v-overlay>
			</v-col>

      
		
	
    <div id="app" class="text-left">
    <v-app id="inspire">
		<v-list>
      <!-- NB! We can create v-model="selectedItem" so when channel is open its color changed
      (for now we dont do this cause there are more important stuff to finish) -->
			<v-list-item-group  > 

				<template v-for="(item, index) in getChannels">
				<v-subheader v-if="item.header" :key="item.header" v-text="item.header"
				></v-subheader>
				<v-divider v-else-if="item.divider" :key="index" :inset="item.inset"
				></v-divider>

				<v-list-item
					v-else
					:key="item.title"
				>
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
              v-if="index < items_.length"
              :key="index"
            ></v-divider>
				</template>
			</v-list-item-group>
		</v-list>
    </v-app>
    </div>
    </v-col>



		<!-- open channel -->
        <v-col cols="auto" sm="6" class="border">
        <div id="app">
          <v-app id="inspire">
            <v-card color="rgba(0,0,0,0)" flat >
              <v-toolbar dense >
                <v-btn elevation="0" min-height="50px"  max-width="50px">
                <v-badge bordered bottom color="green" dot offset-x="4" offset-y="34" class="spacetop" >
                    <v-avatar class="col" elevation="10" size="40px">
                      <div id="app">
                      <img v-bind:src="require('../assets/Screenshot.png')" width="50" height="50">
                      </div>
                    </v-avatar>
                </v-badge>
                </v-btn>
                <v-toolbar-title class="offsetmess">Equipe transcendance</v-toolbar-title>
              </v-toolbar>
            </v-card>

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
          <div class="d-flex textcont">
            <v-text-field
              clearable
              class="messagefield"
              width="100%"
              label="Write a message"
              placeholder="Message"
              @keyup.enter="sendingMessage(this.txt, this.currentChannel)"
              v-model="txt"
            ></v-text-field>
            <!-- <v-btn height="54px" width="20%" color="rgb(0,0,255)" class="spacetop messagefield" @click="sendingMessage(this.txt, this.currentChannel)">
            > // TODO property log doesn't exist ?
            </v-text-field>
            <v-btn height="54px" color="rgb(0,0,255)" class="spacetop" @click="sendingMessage(this.txt, this.currentChannel)"> // TODO this.values may be undefined ?
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

        
        <!-- TABS  -->
        <div id="app" class="pt-6">
          <v-tabs
            fixed-tabs
            v-model="tab"
          >
            <v-tabs-slider color="rgb(0,0,255)"></v-tabs-slider>
            <v-tab
              color="rgb(0,0,255)"
              v-for="(item, index) in items2"
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

  
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
import { useStore, Store } from "vuex";
import { defineComponent } from 'vue'
import TheModale from "./TransChat_modal_pass.vue";
  

export default defineComponent({
  name: "TransChat_group",
  components: {
    'modale': TheModale
  },
  data: () => ({
      revele: false,
      fav: true as boolean,
      menu: false as boolean,
      message: false as boolean,
      hints: true as boolean,
      overlay: false as boolean,
      selected: [2] as number[],
      currentTab: 0 as number,
      tab: null as null | any, // TODO check type
      items: [] as any[], // TODO check type
      items_: [
        {
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
          subtitle: "My cat stole my keys !",
          title: "abaudot",
        },
        {
          photo: "https://smlycdn.akamaized.net/products/270x270-fill/d10a95bb3e/12439acabfc74705974471cc301653097c37adc4.jpg",
          subtitle: "Yeah, a lot of syntaxic sugar.  My cat stole my keys !",
          title: "Equipe transcendence",
        },
        {
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
          subtitle: "My cat stole my keys !",
          title: "abaudot",
        },
        {
          photo: "https://smlycdn.akamaized.net/products/270x270-fill/d10a95bb3e/12439acabfc74705974471cc301653097c37adc4.jpg",
          subtitle: "Yeah, a lot of syntaxic sugar",
          title: "Equipe transcendence",
        },
        {
          photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
          subtitle: "My cat stole my keys !",
          title: "abaudot",
        },
      ] as any, //TODO check type
      model: 1 as number,
      items2: [
        {tabs: 'Members',},
        {tabs: 'Administrators',}
      ] as any,
      members: [
      {   
        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
        title: "abaudot",
      },
      {   
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Wildlife_at_Maasai_Mara_%28Lion%29.jpg/1200px-Wildlife_at_Maasai_Mara_%28Lion%29.jpg",
        title: "anadege",
      },
      {   
        photo: "https://interacnetwork.com/the-content/cream/wp-content/uploads/2021/11/image8.jpg",
        title: "earnaud",
      },
      {   
        photo: "https://nationaltoday.com/wp-content/uploads/2020/10/World-Animal-640x514.jpg",
        title: "alkanaev",
      },
      ] as any,
      admins: [
      {   
        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
        title: "abaudot",
      },
      {   
        photo: "https://nationaltoday.com/wp-content/uploads/2020/10/World-Animal-640x514.jpg",
        title: "alkanaev",
      },
      ] as any, // TODO check type
      txt: '',
      mesasages: [],
      channels: [],
      currentUser: useStore().getters.whoAmI,

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

      userBanned: false,
      userMuted: false,
      banDate: new Date,
      muteDate: new Date,

      newChannel: {
        name:'',
        public: true,
        password: '',
        members: [],
        admins: [],
        },

      protectByPassword: false,

      channelSettings: {
        password: '',
        applyPassword: false,
        members: [],
      },
  }),

  methods: {
    create: function (event: any)  // TODO check event type
    {
      if (event) 
      {
        alert('SUBPAGE OF TRANSCHAT MANAGEMENT WILL BE OPENED')
      }
    },
    toggleModale: function() {
      this.revele = !this.revele;
    }
//there -----------
  },
  watch: {
    overlay (val: boolean) {
      val && setTimeout(() => {
        this.overlay = false
      }, 2000)
    },
  },
	setup() {
		const connection = ref<null | any>(null); //TODO check type
    const store = useStore() as Store<any>;
    var getChannels = store.getters.getChannels as any; //TODO check type
    var isChannelJoined = store.getters.isChannelJoined as any; //TODO check type


		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
				connection.value = io('http://:3000/chat',{
          transportOptions: {
            polling: { extraHeaders: { auth: document.cookie} },
          },
				})
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}
      store.commit('setSocketVal' , connection.value);
			})

      // function joinChannel(id)
      // {
      //   store.commit('setChannelJoinedStatus' , true);
      //   connection.value.emit('joinChannel', id);
      // }
      
      function getPassToJoin()
      {
        // this function is for protected channels (see the specification)
        // as a parameter we will reseve info about the channel, our goal is to chack the password
        // for now it will just open modal window


      }




//     /*
//     onBeforeRouteLeave(() => {
//         const answer = window.confirm("disconect from chat ?")
//         if (answer) {
//           connection.value.disconnect();
//           return true;
//           }
//         return false;
// 		})      */
//         // берет аргс и создает новый канал
//         // for creating a new channel/room: 
// 		// - createChannel { chanName: string, password:string, publicChannel: boolean }
//   /* dont know how to handel the fact that this is done in a other file */
// 		function createChannel(chanName, password, publicChannel)
// 		{
// 			console.log("before createChannel");
// 			connection.value.emit('createChannel', {chanName, users: [], password, publicChannel});
// 			console.log("after createChannel");
// 		}

// 		// for sending message:
// 		// -  message {content: string, channel: Chan, ...}
		function sendingMessage(content: string, channel: any) // TODO check type
		{
      console.log(document.cookie.toString())
			try {
					connection.value = io('http://:3000/chat',{
					transportOptions: {
					polling: { extraHeaders: { auth: document.cookie} },
          withCredentials: true
					},
				})
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}
      console.log(content, channel);
      if (!content)
        return ;
      connection.value.emit('message', {content, channel});
      //console.log(this.txt, this.currentChannel); <- this way will be better but function must be defined in a other place to get acces to this value
			console.log("after message");
		}









// 		// (or just put a channel in argument

// 		// for leaving channel:
// 		// - leaveChannel { channel or id: string}
// 		function leaveChannel(channel)
// 		{
// 			console.log("before leaveChannel");
// 			connection.value.emit('leaveChannel', channel);
// 			console.log("after leaveChannel");
// 		}


// 		// for bloking or unblocking  a user:
// 		// - blockUser{ user: User, block: boolean } // true => block false => unblock
// 		function blockUser(user, block)
// 		{
// 			console.log("before blockUser");
// 			connection.value.emit('blockUser', user, block);
// 			console.log("after blockUser");
// 		}

//     const disconnect = () =>{
// 			connection.value.disconnect()
// 			console.log("disconnect")
// 		}

//     const log = () => {
//       console.log('something happenned');
//     }


// 		/// проверка открытах чатов по базе. автоматически подписать юзера на "основной чат"

//     // useKeypress({
// 		// keyEvent: "keydown",
// 		// keyBinds:
// 		// 	{
// 		// 		keyCode: 13,
// 		// 		success: () => {
// 		// 			gameSocket.value.emit('sendMessage', {matchId: matchId.value, input: "Enter"})
// 		// 		},
// 		// 	},
// 		// })
    console.log("************", getChannels)
		return { sendingMessage, getChannels, isChannelJoined, getPassToJoin }

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

/* .textcont {
  height: 100vh;
} */

.messagefield{
  width:100%;
  /* position: absolute; */
  /* bottom: 0px; */
}

</style>
