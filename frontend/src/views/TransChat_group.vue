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
      <v-overlay :value="overlay"></v-overlay>
			</v-col>

      
		
	

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



          
        
          <v-toolbar dense  color="rgba(0,0,0,0)" class="spacetop">
          <v-text-field
            clearable
            label="Write a message"
            placeholder="Message"
            @keydown.enter.prevent="sending"
          ></v-text-field>
          <v-btn @click="sending">Send</v-btn>
          </v-toolbar>
        </v-app>
        </div>
        </v-col>



		<!-- info group / person -->
		<v-col cols="auto" sm="3" class="border">
          <v-card height="30%" class="text-center offsetphoto" shaped >
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
                <v-list>
                  <v-list-item-group v-model="selectedItem" >
                    
                  </v-list-item-group>
                </v-list>
              </div>
              <div v-show="currentTab === 1">
                <v-list>
                  <v-list-item-group v-model="selectedItem" >
                    
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
