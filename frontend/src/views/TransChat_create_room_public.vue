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
            <v-btn elevation="2" class="offsetmess">
              Upload avatar
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > mdi-plus </v-icon>
            </v-btn>
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



<!-- <template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Password</label>
      <input type="text" class="form-control" v-model="password" placeholder="Password"/><input>
    </div>
    <button class="btn btn-primary btn-block">Submit</button>
  </form>
</template> -->



<script>

export default
{
  name: "NewRoomPublic",
  methods: 
  {
    data(){
      return{
        name: '',
      }
    },
    handleSubmit(){
      const data = {
        name: this.name,
      };
      console.log(data);
      console.log("submitted");
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
