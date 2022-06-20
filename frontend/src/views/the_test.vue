<template>
  <v-app>
<div id="app">
  <h1>Vue Select</h1>
  <v-selection :options="['Canada', 'United States']"></v-selection>
</div>

 </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

export default defineComponent({
  name: "TheTest",
  components: {
   'v-selection': vSelect,
  },
  setup() {}
})
</script>