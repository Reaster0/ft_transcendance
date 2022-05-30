<template>
  <v-app >
    <v-container fluid >
      <v-row >
		<!-- list of chat / search. maybe some buttons  -->
      <v-col cols="auto" sm="3" class="border">
			<v-col>
      <div class="d-flex">
        <v-text-field
          clearable
          label="Find user / group"
          placeholder="Search"
          height = "50px"
        ></v-text-field>
         <v-btn  height="54px" @click="TestTest"><v-icon right dark>mdi-magnify</v-icon></v-btn>
    </div>
      <v-btn to="/newroom" elevation="2">
				Create new chat room
				<v-divider class="mx-2" vertical></v-divider>
				<v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
			</v-btn>
      <v-overlay :value="overlay"></v-overlay>
			</v-col>

      
		
	
    <div id="app" class="text-left">
    <v-app id="inspire">
		<!-- <v-list>
			<v-list-item-group v-model="selectedItem" >
				<template v-for="(item, index) in items">
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
					<v-img :src="item.photo"  min-width="50px" min-height="50px"></v-img>
					</v-list-item-avatar>
					</v-badge>
          </v-btn>
					<v-list-item-content>
					<v-list-item-title class="offsetmess">{{item.title}}</v-list-item-title>
					<v-list-item-subtitle class="offsetmess">{{item.subtitle}}</v-list-item-subtitle>
					</v-list-item-content>
        </v-list-item>
            <v-divider
              v-if="index < items.length"
              :key="index"
            ></v-divider>
				</template>
			</v-list-item-group>
		</v-list> -->
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
                      <img src="http://ic.pics.livejournal.com/alexpobezinsky/34184740/751173/751173_original.jpg" width="50" height="50">
                    </v-avatar>
                </v-badge>
                </v-btn>
                <v-toolbar-title class="offsetmess">Equipe transcendance</v-toolbar-title>
              </v-toolbar>
            </v-card>

            <!-- <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
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
                    It's funny
                  </div>
                  <v-list-item-subtitle> 19:45 </v-list-item-subtitle>  
                </v-list-item-content>
              </v-list-item>
            </v-card >
            </v-toolbar>
              

          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
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
                    It's funny, to know hows websockets works i've made a testing branch (that i wont merge dont worry)
                  </div>
                  <v-list-item-subtitle> 19:45 </v-list-item-subtitle>  
                </v-list-item-content>
              </v-list-item>
            </v-card >
          </v-toolbar>

          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
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

          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
            <v-spacer></v-spacer>
            <v-card class="mt-2 mr-2" max-width="450px" color="rgb(0,0,255)" dark>
              <v-list-item color = "ffffff" >
                <v-list-item-content>
                  <div :style="{color: ' #ffffff'}" class="mb-2">
                    Use as much ts as possible. Then no pb
                  </div>
                  <v-list-item-subtitle :style="{color: ' #ffffff'}"> 19:50 </v-list-item-subtitle>  
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

          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
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
                    Ololo !
                  </div>
                  <v-list-item-subtitle> 19:45 </v-list-item-subtitle>  
                </v-list-item-content>
              </v-list-item>
            </v-card >
          </v-toolbar> -->
          
        
          <!-- <v-toolbar dense  color="rgba(0,0,0,0)" class="spacetop"> -->
          <div class="d-flex">
            <v-text-field
              clearable
              label="Write a message"
              placeholder="Message"
              @click.prevent="TestTest"
            ></v-text-field>
            <v-btn height="54px" color="rgb(0,0,255)" class="spacetop" @click="TestTest">
              <div  :style="{color: ' #ffffff'}">
                send
              </div>
            </v-btn>
          </div>
          <!-- </v-toolbar> -->
        </v-app>
        </div>
        </v-col>



		<!-- info group / person -->
		<v-col cols="auto" sm="3" class="border">
          <v-card height="22%" class="text-center offsetphoto" shaped >
             <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
                   <v-avatar class="s" elevation="10" size="60px">
                      <img src="http://ic.pics.livejournal.com/alexpobezinsky/34184740/751173/751173_original.jpg" width="70" height="70">
                    </v-avatar>
             </v-badge>
                <v-card-title class="layout justify-center">Equipe transcendance</v-card-title>
                <v-card-subtitle class="layout justify-center">The best team</v-card-subtitle>
          </v-card>

          <div id="app" class="pt-6">
          <v-btn v-on:click="create" elevation="2" width="350px">
            Leave the chat room
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

  
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>



<script>
// создание и объявление компонентов. В темплейте мы по ним будем итерироваться.
// https://codesource.io/vue-export-default-vs-vue-new/
  import { onMounted } from "@vue/runtime-core"
  import { ref } from "vue"
  import io from 'socket.io-client';
  //import { useKeypress } from "vue3-keypress";

export default 
{
  data: () => 
  ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
      overlay: false,
      selected: [2],
      currentTab: 0,
      tab: null,
      items0: ['tab0', 'tab1', 'tab2', 'tab3', 'tab4'],
      items: [
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
      ],
      model: 1,
      items2: [
        {tabs: 'Members',},
        {tabs: 'Administrators',}
      ],
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
      ],
      admins: [
      {   
        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KsZg3MKYqvpcToJi_jSPryQtPRNekrGvfQ&usqp=CAU",
        title: "abaudot",
      },
      {   
        photo: "https://nationaltoday.com/wp-content/uploads/2020/10/World-Animal-640x514.jpg",
        title: "alkanaev",
      },
      ],
  }),
  methods: {
    create: function (event) 
    {
      // `this` fait référence à l'instance de Vue à l'intérieur de `methods`
      // alert('Bonjour ' + this.name + ' !')
      // `event` est l'évènement natif du DOM
      if (event) 
      {
        alert('SUBPAGE OF TRANSCHAT MANAGEMENT WILL BE OPENED')
      }
    }
  },
  watch: {
    overlay (val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 2000)
    },
  },
	setup()
    {
		const connection = ref(null)
		//const matchId = ref(null)

		onMounted(() =>{
			console.log(document.cookie.toString())
			try {
					connection.value = io('http://172.20.10.10:3000/chatgroup',{
					transportOptions: {
					polling: { extraHeaders: { auth: document.cookie} },
					},
				})
				console.log("starting connection to websocket")
			} catch (error) {
				console.log("the error is:" + error)
			}

            // : connection.value.on(‘command’, (received) => {})
            connection.value.on('channel', (channels) => 
            {console.log("channel:" + channels)})

			NewChannel();
      TestTest();
			SendingMessage();
			JoinChannel();
			LeaveChannel();
			BlockUser();
			})

        // берет аргс и создает новый канал
        // for creating a new channel/room: 
		// - createChannel { chanName: string, password:string, publicChannel: boolean }
		function NewChannel(chanName, password, publicChannel)
		{
			console.log("before createChannel");
			connection.value.emit('createChannel', chanName, password, publicChannel);
			console.log("after createChannel");
		}

		// for sending message:
		// -  message {content: string, channel: Chan, ...}
		function SendingMessage(content, channel)
		{
			console.log("before message");
			connection.value.emit('message', content, channel);
			console.log("after message");
		}

		// for joinning a existing channel
		// - joinChannel { id: string }
		function JoinChannel(id)
		{
			console.log("before joinChannel");
			connection.value.emit('joinChannel', id);
			console.log("after joinChannel");
		}

		// (or just put a channel in argument

		// for leaving channel:
		// - leaveChannel { channel or id: string}
		function LeaveChannel(channel)
		{
			console.log("before leaveChannel");
			connection.value.emit('leaveChannel', channel);
			console.log("after leaveChannel");
		}


		// for bloking or unblocking  a user:
		// - blockUser{ user: User, block: boolean } // true => block false => unblock
		function BlockUser(user, block)
		{
			console.log("before blockUser");
			connection.value.emit('blockUser', user, block);
			console.log("after blockUser");
		}


		/// проверка открытах чатов по базе. автоматически подписать юзера на "основной чат"

    function TestTest(){
			console.log("befor createChannel");
			connection.value.emit('createChannel');
			console.log("after createChannel")
		}

    // useKeypress({
		// keyEvent: "keydown",
		// keyBinds:
		// 	{
		// 		keyCode: 13,
		// 		success: () => {
		// 			gameSocket.value.emit('sendMessage', {matchId: matchId.value, input: "Enter"})
		// 		},
		// 	},
		// })

		return {TestTest, NewChannel, SendingMessage, JoinChannel, LeaveChannel, BlockUser}

	}
};

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
