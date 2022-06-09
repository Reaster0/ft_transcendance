<template>
  <v-container>
    <particles-bg type="cobweb" :bg="true" />
    <v-img :aspect-ratio="16/9" height="500" src="../assets/42_Logo.svg"/>
    <v-row>
          <v-col align="center">
          <h1 class="text">Play the</h1>
          <v-btn elevation="24" outlined rounded min-height="100" min-width="200" color="rgb(255, 0, 0)" to="/game">
            <h1 class="text rainbow glitch" data-text="Future">Game</h1>
          </v-btn>
          </v-col>
  </v-row>
  </v-container>
</template>

<script lang="ts">
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue
import { useStore } from "vuex"
import { onMounted } from "@vue/runtime-core"
import { isLogged } from "../components/FetchFunctions"
export default {
	components: {
		ParticlesBg
	},
	setup(){
		onMounted(async() => {
		useStore().commit('setConnected' , await isLogged())
		})
	}
}
</script>

<style lang="scss" scoped>
.text{
	font-size: 4em;
  font-family: Spotnik;
	font-weight: bold;
	color: white;
	cursor: pointer;
	transition: text-shadow 1s;
}
.rainbow:hover {
text-shadow: 0.04em 0.04em #fc0049,
        0.08em 0.08em #fe8f01,
        0.12em 0.12em #fdf21f,
        0.16em 0.16em #3fdf4b,
        0.2em 0.2em #3462fe;
}
.glitch{
  color: white;
  font-size:4em;
  position:relative;
  width: 5em;
  margin:0 auto;
}
@keyframes noise-anim{
  $steps:20;
  @for $i from 0 through $steps{
    #{percentage($i* calc(1/$steps))}{
      clip:rect(random(100)+px,9999px,random(100)+px,0);
    }
  }
}
.glitch:after{
  content:attr(data-text);
  position:absolute;
  left:2px;
  text-shadow:-1px 0 red;
  top:0;
  color:white;
  background: red;
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim 2s infinite linear alternate-reverse;
}
@keyframes noise-anim-2{
  $steps:20;
  @for $i from 0 through $steps{
    #{percentage($i* calc(1/$steps))}{
      clip:rect(random(100)+px,9999px,random(100)+px,0);
    }
  }
}
.glitch:before{
  content:attr(data-text);
  position:absolute;
  left:-2px;
  text-shadow:1px 0 blue; 
  top:0;
  color:white;
  background:black;
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim-2 3s infinite linear alternate-reverse;
}
</style>
