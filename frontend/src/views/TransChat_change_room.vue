<template>
  <v-app >
    <v-container fluid >

        <v-toolbar
          dark
          color="rgb(0,0,255)"
        >
          <v-btn
            to="/adm"
            icon
            dark
            @click="dialog = false"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title >
            <div :style="{color: ' #ffffff'}">
              Chat room settings
            </div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn to="/thechat" color = "ffffff" >
              <div :style="{color: ' #ffffff'}">
                SAVE
              </div>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>


                <v-divider></v-divider>

      <v-radio-group v-model="radios">
        <v-list class="spacetop">


        <v-radio value="public">
          <template v-slot:label>
            <div>
            <p class="font-weight-black">
              Make the chat room public
            </p>
            <p>
              Visible and accesible for anyone
            </p>
            </div>
          </template>
        </v-radio>

                <v-divider class="mb-6"></v-divider>
        <v-radio value="private">
          <template v-slot:label>
            <div>
            <p class="font-weight-black">
              Make the chat room private
            </p>
            <p>
              Accecible for users that has a direct link
            </p>
            </div>
          </template>
        </v-radio>
        
                <v-divider class="mb-6"></v-divider>

        <v-radio value="protected">
          <template v-slot:label>
            <div>
            <p class="font-weight-black">
              Make the chat protected or change the password
            </p>
            <p>
              Accesible by the password
            </p>
            </div>
          </template>
        </v-radio>
        <v-col cols="12" sm="6">
            <v-text-field
              clearable
              label="Set a password"
              placeholder="Password"
            ></v-text-field>
        </v-col>
        
                <v-divider class="mb-6"></v-divider>


        <div>
        <p class="font-weight-black offsetmess">
          Change the avatar
        </p>
        </div>
        <v-col cols="12" sm="6" class="offsetmess">
            <v-btn elevation="2">
              Upload new avatar
            </v-btn>
        </v-col>

        </v-list> 
      </v-radio-group>
    </v-container>
  </v-app>
</template>



<script lang="ts">
// создание и объявление компонентов. В темплейте мы по ним будем итерироваться.
// https://codesource.io/vue-export-default-vs-vue-new/
export default 
{
  data: () => ({
    public: false,
    private: false,
    protected: true,
  }),
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
