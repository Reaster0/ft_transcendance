<template>
  <v-app >
    <v-container fluid>
      <h3>Please, choose a type of new chat room</h3>
      <!-- <v-divider class="mb-6"></v-divider> -->

            <div class="spacetopplus">
            <p class="font-weight-black">
              Public chat 
            </p>
            <p>
              Visible and accesible for anyone
            </p>
          <v-btn color = "rgb(0,0,255)" width="240px" to="/publicroom">
            <div :style="{color: ' #ffffff'}">
              Create public room
            </div>
          </v-btn>
          </div>

          <v-divider ></v-divider>

          <div class="spacetopplus">
            <p class="font-weight-black">
              Private chat 
            </p>
            <p>
              Accecible for users that has a direct link
            </p>
          <v-btn color = "rgb(0,0,255)" width="240px" to="/privateroom">
            <div :style="{color: ' #ffffff'}">
              Create private room
            </div>
          </v-btn>
          </div>

          <v-divider></v-divider>

          <div class="spacetopplus">
            <p class="font-weight-black">
              Protected chat 
            </p>
            <p>
              Accesible by the password
            </p>
          <v-btn color = "rgb(0,0,255)" width="240px" to="/protectedroom">
            <div :style="{color: ' #ffffff'}">
              Create protected room
            </div>
          </v-btn>
          </div>

    </v-container>
  </v-app>
</template>




<script>

export default
{
  name: "NewRoom",
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

.spacetopplus {
  padding-top: 30px;
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
