<template>
  <v-app >
    <v-container fluid >

      <!-- <v-card> -->
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
          <v-toolbar-items>
            <v-btn @click.prevent="NewChannel" color = "ffffff" >
              <div :style="{color: ' #ffffff'}">
                Create
              </div>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>


                <v-divider></v-divider>

      <v-radio-group v-model="radios" class="spacebottom">
        <v-list class="spacetop">
        <v-radio value="Public">
          <template v-slot:label>
            <div>
            <p class="font-weight-black">
              Public chat 
            </p>
            <p>
              Visible and accesible for anyone
            </p>
            </div>
          </template>
        </v-radio>
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
            ></v-text-field>
        </v-col>

                <v-divider class="mb-6"></v-divider>
        <v-radio value="Private">
          <template v-slot:label>
            <div>
            <p class="font-weight-black">
              Private chat 
            </p>
            <p>
              Accecible for users that has a direct link
            </p>
            </div>
          </template>
        </v-radio>
        <v-col cols="12" sm="6">
            <v-btn elevation="2" class="offsetmess">
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
            ></v-text-field>
        </v-col>

                <v-divider class="mb-6"></v-divider>
        <v-radio value="Protected">
          <template v-slot:label>
            <div>
            <p class="font-weight-black">
              Protected chat 
            </p>
            <p>
              Accesible by the password
            </p>
            </div>
          </template>
        </v-radio>

        <v-col cols="12" sm="6">
            <v-btn elevation="2" class="offsetmess">
              Upload avatar
              <v-divider class="mx-2" vertical></v-divider>
              <v-icon color="rgb(0,0,255)" > msdi-plus </v-icon>
            </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
            <v-text-field
              clearable
              label="Name of the room"
              placeholder="name"
            ></v-text-field>
            <v-text-field
              clearable
              label="Set a password"
              placeholder="Password"
            ></v-text-field>
        </v-col>
        </v-list> 
      </v-radio-group>
    </v-container>
  </v-app>
</template>



<script>
// создание и объявление компонентов. В темплейте мы по ним будем итерироваться.
// https://codesource.io/vue-export-default-vs-vue-new/



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
