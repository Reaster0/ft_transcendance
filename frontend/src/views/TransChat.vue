<template>
  <v-app >
    <v-container fluid >
      <v-row>
		<!-- list of chat / search. maybe some buttons  -->
        <v-col cols="auto" sm="3" class="border">
			<v-col>
            <v-text-field
				clearable
				label="Find user / group"
				placeholder="Search"
            ></v-text-field>
			<v-btn elevation="2">
				Create new chat room
				<v-divider class="mx-2" vertical></v-divider>
				<v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
			</v-btn>
			</v-col>
		
	

		<v-list dense>
			<v-list-item-group 	v-model="selectedItem" color="primary">
				<template v-for="(item, index) in items">
				<v-subheader v-if="item.header" :key="item.header" v-text="item.header"
				></v-subheader>
				<v-divider v-else-if="item.divider" :key="index" :inset="item.inset"
				></v-divider>
		
				<v-list-item
					v-else
					:key="item.title"
				>
					<v-badge bordered bottom color="green" dot offset-x="6" offset-y="34" >
					<v-list-item-avatar>
					<v-img :src="item.photo"></v-img>
					</v-list-item-avatar>
					</v-badge>
					<v-divider class="mx-2" vertical></v-divider>
					<v-list-item-content>
					<v-list-item-title v-html="item.title"></v-list-item-title>
					<v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
					<v-divider
						v-if="index < items.length"
						:key="index"
					></v-divider>
				</template>
			</v-list-item-group>
		</v-list>
    </v-col>



		<!-- open channel -->
        <v-col cols="auto" sm="6" class="border">


          <div id="app">
          <v-app id="inspire">
            <v-card color="grey lighten-4" flat tile >
              <v-toolbar dense>
                <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
                <v-badge bordered bottom color="green" dot offset-x="4" offset-y="30" class="spacetop" >
                    <!-- <v-avatar class="spacetop" size="36" elevation="10"> -->
                      <img src="https://smlycdn.akamaized.net/products/270x270-fill/d10a95bb3e/12439acabfc74705974471cc301653097c37adc4.jpg" />
                    <!-- </v-avatar> -->
                </v-badge>
                <v-divider class="mx-2" vertical color="rgba(0,0,0,0)"></v-divider>
                <v-toolbar-title>Equipe transcendance</v-toolbar-title>
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
            </v-card>
          </v-app>
        </div>


        <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
        <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
          <v-avatar class="mt-n4 " size="32" elevation="2">
                <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
          </v-avatar>
        </v-badge>
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
        <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
          <v-avatar class="mt-n4 " size="32" elevation="2">
                <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
          </v-avatar>
        </v-badge>
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
          <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
            <v-avatar class="mt-n4 " size="32" elevation="2">
                  <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
            </v-avatar>
          </v-badge>
          <v-card class="mt-2 ml-2" max-width="450px" color="rgb(0,0,255)">
            <v-list-item >
              <v-list-item-content>
                <div :style="{color: ' #ffffff'}" class="mb-2">
                  Yeah, a lot of syntaxic sugar
                </div>
                <v-list-item-subtitle :style="{color: ' #ffffff'}"> 19:45 </v-list-item-subtitle>  
              </v-list-item-content>
            </v-list-item>
          </v-card >
        </v-toolbar>

        <v-toolbar dense  color="rgba(0,0,0,0)" class="spacebottom">
          <v-badge bordered bottom color="green" dot offset-x="4" offset-y="10">
            <v-avatar class="mt-n4 " size="32" elevation="2">
                  <img src="https://www.referenseo.com/wp-content/uploads/2019/03/image-attractive-960x540.jpg" />
            </v-avatar>
          </v-badge>
          <v-card class="mt-2 ml-2" max-width="450px" color="rgb(0,0,255)">
            <v-list-item >
              <v-list-item-content>
                <div :style="{color: ' #ffffff'}" class="mb-2">
                  Use as much ts as possible. Then no pb
                </div>
                <v-list-item-subtitle :style="{color: ' #ffffff'}"> 19:45 </v-list-item-subtitle>  
              </v-list-item-content>
            </v-list-item>
          </v-card >
        </v-toolbar>

        
        <v-col>
        <v-text-field
          clearable
          label="Write a message"
          placeholder="Message"
        ></v-text-field>
        </v-col>

          </v-col>

		<!-- info group / person -->
		<v-col cols="auto" sm="3" class="border">
          <v-card class="text-center mt-8 mb-3" shaped >
             <v-badge bordered bottom color="green" dot offset-x="11" offset-y="13">
                <!-- <v-avatar size="60" elevation="10"> -->
                  <img src="https://smlycdn.akamaized.net/products/270x270-fill/d10a95bb3e/12439acabfc74705974471cc301653097c37adc4.jpg" />
                <!-- </v-avatar> -->
             </v-badge>
                <v-card-title class="layout justify-center">Equipe transcendance</v-card-title>
                <v-card-subtitle class="layout justify-center">The best team</v-card-subtitle>
                <v-list></v-list>
          </v-card>

			<div id="app">
			<v-app id="inspire">
				<v-toolbar
					color="white"
					dark
					flat
				>
				<template v-slot:default>
				<v-tabs>
					<v-tabs-slider ></v-tabs-slider>
					<v-tab
					color="rgb(0,0,255)"
					v-for="item in items2"
					:key="item"
					>
					{{ item.tabs }}
					</v-tab>
				</v-tabs>
				</template>
				</v-toolbar>
				<v-tabs-items v-model="tab">
					<v-tab-item
					v-for="item in items2"
					:key="item"
					>
					{{ item.text }}
					</v-tab-item>
				</v-tabs-items>
			</v-app>
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
    //  selected: [2],
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
      items2: [
		{
			tabs: 'Members',
			// text: 'list of members / ',
		},
        {
			tabs: 'Administrators',
			// text: 'list of administrators',
		}
      ],

  }),
  
  // computed: 
  // {
  //   // theme() {
  //   //   return this.$vuetify.theme.dark ? "dark" : "light";
  //   // },
    
  // },
    computed: {
      className() {
        return {
          'chat__own': this.message.type === 'own',
          'chat__others': this.message.type === 'others'
        }
      }
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
  padding-bottom: 30px;
}
.spacetop {
  padding-top: 50px;
  padding-bottom: 20px;
}

.offsetmess {
  padding-right: 10px;
  padding-left: 10px;
}

</style>
