<template>
  <v-app >
    <v-container fluid>
      <form @submit.prevent="submitIt(this.name)">

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
            <v-btn :style="{color: ' #ffffff'}" to="/chatgroup">
              OK
            </v-btn>
        </v-toolbar>


            <div class="offsettitle">
            <p class="font-weight-black">
              Private chat 
            </p>
            <p>
              Accecible for users that has a direct link
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

            <button class="button">SUBMIT</button>
        </v-col>


    </form>
    </v-container>
  </v-app>
</template>




<script>
  import { onMounted } from "@vue/runtime-core"
  import { ref } from "vue"
  import io from 'socket.io-client';
  import { useStore } from "vuex";

export default
{
  name: "NewRoomPrivate",
  data() {
    return {
      // created: false,
      name: "",
      file: [],
      // currentUser: useStore().getters.whoAmI,
    };
  },
  methods: {
    submitbutton() {
      // console.log(this.created);
      console.log(this.name);
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
      let thechannels = [];
      const store = useStore();
      onMounted(() =>{
        console.log(document.cookie.toString())
        try {
            connection.value = io('http://localhost:3000/chat',{
            transportOptions: {
            polling: { extraHeaders: { auth: document.cookie} },
            withCredentials: true,
            },
          })
          console.log("starting connection to websocket")
        } catch (error) {
          console.log("the error is:" + error)
        }

        connection.value.on("channel", function(res) {
          console.log('befor update');
          console.log(thechannels);
          console.log('creating channel');

          // reset channel
          thechannels = [];
          for (const chan of res){
              let d = {}
              console.log(">>>>>>>>>> " + chan.channelName)
              d.title = chan.channelName
              // scenario for ava
              // d.avatar = chan.avatar
              thechannels.push(d)
          }

          console.log('after update');
          console.log(thechannels);
          store.commit('setChannels' , thechannels);
          console.log(store.getters.getChannels);
        })
      })

      function submitIt(name)
      {
        // const channame = this.name;
        const password = "";
        const publ = false;
        // const user = this.currentUser;
        console.log("name: " + name)
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

.button {
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: rgb(0,0,255);
}

</style>
