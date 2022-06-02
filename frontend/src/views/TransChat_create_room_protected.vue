<template>
  <v-app >
    <v-container fluid>
      <form @submit.prevent="handleSubmit">
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
          <input type="file" ref="file" style="display: none">
            <v-btn elevation="2" class="offsetmess" @click="$refs.file.click()">
              Upload avatar
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn>
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
import axios from 'axios'
export default
{
  name: "NewRoomProtected",
  methods: 
  {
    data(){
      return{
        name: '',
        password: ''
      }
    },
    handleSubmit(){
      const data = {
        name: this.name,
        password: this.password,
      };
      // console.log(data);
      console.log("submitted");
      axios.post("http://localhost:3000/chat/protectedroom", data)
        .then(
          res => {
            console.log(res);
          }
        ).catch(
            err => {
            console.log(err);
          }
        )
    }
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
