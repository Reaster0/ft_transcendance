<template>
  <v-app >
    <v-container fluid>
      <form @submit.prevent="submitIt(this.name, this.password)">
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
          <button class="btn btn-primary btn-block" :style="{color: ' #ffffff'}">SUBMIT</button>
        </v-toolbar>


            <div class="offsettitle">
            <p class="font-weight-black">
              Protected chat 
            </p>
            <p>
              Accesible by the password
            </p>
            </div>

        <v-col cols="12" sm="6">
          <input type="file" @change="previewFiles" multiple >
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field
              clearable
              label="Name of the room"
              placeholder="name"
              v-model="name"
            ></v-text-field>
            <v-text-field
              clearable
              label="Set a password"
              placeholder="Password"
              v-model="password"
            ></v-text-field>
        </v-col>

    </form>
    </v-container>
  </v-app>
</template>




<script>
import { onMounted } from "@vue/runtime-core"
import { ref } from "vue"
import io from 'socket.io-client';
export default
{
  name: "NewRoomProtected",
  data() {
    return {
      // created: false,
      name: "",
      password: "",
      file: [],
      // currentUser: useStore().getters.whoAmI,
    };
  },
  methods: {
    submitbutton() {
      // console.log(this.created);
      console.log(this.name);
      console.log(this.password);
      console.log(this.file);
      this.created = true;
    },
    previewFiles(event) {
        this.file = event.target.files[0];
        console.log(event.target.files[0]);
    }
  },
  setup()
  {
      const connection = ref(null)
      onMounted(() =>{
        console.log(document.cookie.toString())
        try {
            connection.value = io('http://localhost:3000/chat',{
            transportOptions: {
            polling: { extraHeaders: { auth: document.cookie} },
            withCredentials: true
            },
          })
          console.log("starting connection to websocket")
        } catch (error) {
          console.log("the error is:" + error)
        }
      })

      function submitIt(name, password)
      {
        // const channame = this.name;
        const publ = false;
        // const user = this.currentUser;
        console.log("name: " + name)
        console.log("password: " + password)
        if (name != '')
          connection.value.emit('createChannel', {channelName: name, users: [], password, publicChannel: publ});    
      }

      return { submitIt }
  }
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
