<template>
  <v-app >
    <v-container fluid>
      <form @submit.prevent="submitbutton">
        <v-toolbar
          dark
          color="rgb(0,0,255)"
        >
          <v-btn
            to="/chatgroup"
            icon
            dark
            @click="dialog = false"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title >
            <div :style="{color: ' #ffffff'}">
              New chat room settings
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <button class="btn btn-primary btn-block" :style="{color: ' #ffffff'}" to="/">SUBMIT</button>
        </v-toolbar>


                <v-divider></v-divider>

            <div class="offsettitle">
            <p class="font-weight-black">
              Public chat 
            </p>
            <p>
              Visible and accesible for anyone
            </p>
            </div>
        <v-col cols="12" sm="6">
          <!-- <input type="file" ref="file" style="display: none"> -->
          <input type="file" @change="previewFiles" multiple >
            <!-- <v-btn elevation="2" class="offsetmess" @change="previewFiles" v-model="file">
              Upload avatar
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn> -->
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field
              class="spacetoponly"
              clearable
              label="Name of the room"
              placeholder="name"
              v-model="name"
            ></v-text-field>
        </v-col>

              


    </form>
    </v-container>
  </v-app>
</template>


<script>
// import axios from 'axios'
// import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
// import { useStore } from "vuex";

export default
{
  name: "NewRoomPublic",
  data() {
    return {
      // created: false,
      name: "",
      file: [],
      // currentUser: useStore().getters.whoAmI,
    };
  },
  methods: {
    async submitbutton() {
      // console.log(this.created);
      console.log(this.name);
      console.log(this.file);
      this.created = true;
      const connection = ref(null)
      console.log(document.cookie.toString())
      try {
          connection.value = await io('http://localhost:3000/chat',{
          transportOptions: {
          polling: { extraHeaders: { auth: document.cookie} },
          },
        })
        console.log("starting connection to websocket")
      } catch (error) {
        console.log("the error is:" + error)
      }
      const channame = this.name;
      const password = "";
      const publ = true;
      // const user = this.currentUser;
      // emit only if this.name isnt empty
      if (this.name != '')
      connection.value.emit('createChannel', {channame, users: [], password, publ});

    },
    previewFiles(event) {
        this.file = event.target.files[0];
        console.log(event.target.files[0]);
    }
  },




  // methods: 
  // {
  //   data(){
  //     return{
  //       name: '',
  //     }
  //   },
  //   handleSubmit(){
  //     const data = {
  //       name: this.name,
  //     };
  //     console.log(data);
  //     console.log("submitted");
  //     axios.post("http://localhost:3000/chat/publicroom", data)
  //       .then(
  //         res => {
  //           console.log(res);
  //         }
  //       ).catch(
  //           err => {
  //           console.log(err);
  //         }   
  //       )
  //   }
  // },

  
	// setup()
  //   {
	// 	const connection = ref(null)

	// 	onMounted(() =>{
	// 		console.log(document.cookie.toString())
	// 		try {
	// 				connection.value = io('http://localhost:3000/chat/publicroom',{
	// 				transportOptions: {
	// 				polling: { extraHeaders: { auth: document.cookie} },
	// 				},
	// 			})
	// 			console.log("senfing")
	// 		} catch (error) {
	// 			console.log("err of senfing " + error)
	// 		}

  //     connection.value.on('name', (name) => 
  //       {console.log("cname:" + name)})
  //   })
  // }
}


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

.offsettitle {

  padding-top: 30px;
  padding-left: 20px;
}

.offsetphoto {
  padding-top: 20px;
}

.row>.col {
  flex-basis: auto;
}

</style>
