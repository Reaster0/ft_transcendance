<template>
  <v-app >
    <v-container fluid>
      <h3>Please, choose a type of new chat room</h3>
            <div class="spacetopplus">
            <p class="font-weight-black">
              Public chat 
            </p>
            <p>
              Visible and accessible for anyone
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
              Accessible for users that has a direct link
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
              Accessible by the password
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




<script lang="ts">

import { defineComponent } from "vue";
import { onBeforeRouteLeave } from 'vue-router';
import { Store, useStore } from 'vuex';
import leaveChat from '../helper';

export default defineComponent({
  name: "NewRoom",
  data() {
    return {
      name: '' as string,
      password: '' as string
    }
  },
  methods: {
    handleSubmit(): void {
      const data = {
        name: this.name,
        password: this.password,
      } as {name : string, password : string };
      console.log(data);
      console.log("submitted");
    }
  },
  setup () {

    let store = useStore() as Store<any>;

    onBeforeRouteLeave( function(to: any, from: any, next: any) {
      void from;
      const socket = store.getters.getSocketVal;
      leaveChat(socket, to, next);
    })
  }
})
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
