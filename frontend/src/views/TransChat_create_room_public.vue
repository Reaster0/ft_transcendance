<template>
  <v-app >
    <v-container fluid>
      <v-form @submit.prevent="submitIt(this.name)">
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
          <!-- <v-spacer></v-spacer> -->
            <v-spacer></v-spacer>
            <v-btn :style="{color: ' #ffffff'}" to="/chatgroup">
              OK
            </v-btn>
          
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
          <button class="button button1">SUBMIT</button>
        </v-col>

              


    </v-form>
    </v-container>
  </v-app>
</template>


<script>
  import { onMounted } from "@vue/runtime-core"
  import { ref } from "vue"
  import io from 'socket.io-client';
//import { onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
  //import { useKeypress } from "vue3-keypress";


export default
{
  name: "NewRoomPublic",
  data() {
    return {
      // created: false,
      name: "",
      file: [],
      items: [],
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
      // var channels = [];
      // const connection = ref(null)
      let thechannels = [];
      const connection = ref(null)
      onMounted(() =>{
        // console.log(document.cookie.toString())
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

        // connection.value.on("channel", chans => {
        //     console.log(chans)
        //     for (const key in chans) {
        //         let value = chans[key];
        //         // this.items.push(value.channelName)
        //         console.log(value.channelName)
        //     }
        //   })
        // connection.value.on("channel", function(res) {

        //   console.log('befor update');
        //   console.log(channels);
        //   console.log('creating channel');

        //   // reset channel
        //   channels = [];
        //   for (const chan of res) 
        //       channels.push(chan.channelName);

        //   console.log('after update');
        //   console.log(channels)
        // })
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
              thechannels.push(d)
          }

          console.log('after update')
          console.log(thechannels)
          useStore().commit('setChannels' , thechannels)
        })
      })

      function submitIt(name)
      {
        // const channame = this.name;
        const password = "";
        const publ = true;
        // const user = this.currentUser;
        // emit only if this.name isnt empty
        // if (this.name != '')
        // connection.value.emit('createChannel', {channame, users: [], password, publ});
        console.log("name: " + name)
        // console.log("file: " + file)
        if (name )
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
}

.button {background-color: rgb(0,0,255);} /* Blue */

</style>
