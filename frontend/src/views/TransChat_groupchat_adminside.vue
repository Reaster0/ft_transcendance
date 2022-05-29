<template>
  <v-app >
    <v-container fluid >
      <v-row >
		<!-- list of chat / search. maybe some buttons  -->
      <v-col cols="auto" sm="3" class="border">
			<v-col>
            <v-text-field
				clearable
				label="Find user / group"
				placeholder="Search"
            ></v-text-field>
      <v-btn to="/newroom" elevation="2">
				Create new chat room
				<v-divider class="mx-2" vertical></v-divider>
				<v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
			</v-btn>
			</v-col>

      
		
	
    <div id="app" class="text-left">
    <v-app id="inspire">
		<v-list>
      <!-- <v-simple-table dense> -->
			<!-- <v-list-item-group v-model="selectedItem" > -->
      <v-list-item-group >
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
		</v-list>
    </v-app>
    </div>
    </v-col>


        <v-col cols="auto" sm="6" class="border">
        <div id="app">
          <v-app id="inspire">
            <v-card color="rgba(0,0,0,0)" flat >
              <v-toolbar dense >
                <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
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

        <!-- <v-app> -->
            <!-- MESSAGE 4 OTHER -->
            <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
              <!-- ava chat -->
              <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
                <v-avatar class="mt-n4 " size="32" elevation="2">
                      <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
                </v-avatar>
              </v-badge>
              </v-btn>
            <!-- field chat -->
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
              

          <!-- MESSAGE 3 OTHER -->
          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
              <!-- ava chat -->
              <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
                <v-avatar class="mt-n4 " size="32" elevation="2">
                      <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
                </v-avatar>
              </v-badge>
              </v-btn>
            <!-- field chat -->
            <!-- <v-card class="mt-2 ml-2" max-width="350px"> -->
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


          <!-- MESSAGE 2 -->
          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
            <v-spacer></v-spacer>
            <!-- field chat -->
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
            <!-- ava chat -->
            <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
              <v-avatar class="mt-n4 " size="32" elevation="2">
                    <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
              </v-avatar>
              </v-badge>
            </v-btn>
          </v-toolbar>


          <!-- MESSAGE 1 -->
          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
            <v-spacer></v-spacer>
            <!-- field chat -->
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
            <!-- ava chat -->
            <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
              <v-avatar class="mt-n4 " size="32" elevation="2">
                    <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
              </v-avatar>
              </v-badge>
            </v-btn>
          </v-toolbar>

          <!-- MESSAGE 0 OTHER -->
          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
              <!-- ava chat -->
              <v-btn elevation="0" min-height="50px"  max-width="50px">
              <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
                <v-avatar class="mt-n4 " size="32" elevation="2">
                      <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
                </v-avatar>
              </v-badge>
              </v-btn>
            <!-- field chat -->
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
          </v-toolbar>
          
        
          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacetop">
          <v-text-field
            clearable
            label="Write a message"
            placeholder="Message"
          ></v-text-field>
          </v-toolbar>
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
          <v-btn v-on:click="create" elevation="2" width="350px" color="red">
            Leave the chat room
          </v-btn>
          </div>
          <div id="app">
          <v-btn to="/roomsettings" elevation="2" width="350px">
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
                      <v-btn to="/mu"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        elevation="0"
                      >
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
                      <v-btn to="/mu"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        elevation="0"
                      >
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

  
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>



<script>
// создание и объявление компонентов. В темплейте мы по ним будем итерироваться.
// https://codesource.io/vue-export-default-vs-vue-new/
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
        alert('YOU ARE OWNER OR THE CHAT RROM\n IF YOU LEAVE THE ROOM - IT WILL BE DELETED AUTOMATICALLY')
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
