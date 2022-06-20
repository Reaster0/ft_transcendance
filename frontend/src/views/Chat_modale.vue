<template>
  <div class="bloc-modale" v-if="showPasswordModal">
    <div class="overlay" v-on:click="toggleModal"></div>
      <div class="modale card">
        <v-card>
          <v-card-title>
            <span class="text-h5">This channel require a password</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Password*" type="password"
                    v-model="password" required>
                  </v-text-field>
                  <small>*required field</small>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="toggleModal">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="enterPassword">
              Validate
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent ({
  name: "TheModale",
  props: ["showPasswordModal", "toggleModal"],
  setup(props, { emit }) {
    let password = ref<string>('');

    function enterPassword() {
      emit('password', password.value);
    }

    return { enterPassword, password };
  }
});
</script> 

<style scoped>
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: #f1f1f1;
  color: #333;
  padding: 3px;
  border-radius:5px;
  position: fixed;
  top: 30%;
}

.btn-modale {
  position: absolute;
  border-radius:60px;
  top: 10px;
  right: 10px;
}
</style>
