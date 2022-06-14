<template>
	<v-toolbar flat dense app color="black">
		<!-- <v-toolbar-title> -->
			<router-link to="/" style="text-decoration: none; color: inherit;">
				<h1 class="glitch Spotnik" data-text="TRANSCENDENCE">TRANSCENDENCE</h1>
			</router-link>
		<!-- </v-toolbar-title> -->
			<v-spacer></v-spacer>
				<v-btn class="Spotnik" :to="{ name: 'Chat' }" flat color="grey" align-end="true">
					Chat
				</v-btn>
				<v-btn class="Spotnik" v-if="!isLog" to="/login" flat color="grey" align-end="true">
					Login
					<v-icon>mdi-login</v-icon>
				</v-btn>
				<div v-else>
					<v-btn class="Spotnik" to="/user" flat color="grey" align-end="true">
						Account
						<v-icon>mdi-login</v-icon>
					</v-btn>
					<v-btn class="Spotnik" color="red" @click="logOut" to="/">Logout</v-btn>
				</div>
	</v-toolbar>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
	setup() {
		const store = useStore()
		const isLog = computed(() => {
			return store.getters.isConnected
		})

		async function logOut() {
			await fetch(process.env.VUE_APP_BACKEND + "/users/logout", {credentials: "include", method: "PATCH"})
			.then(store.commit('setConnected', [false, false]) as any)
		}

		return {isLog, logOut}
	}
}
</script>

<style lang="scss">

@font-face {
	font-family: "Spotnik";
	src: url("../assets/Spotnik.ttf");
}

.Spotnik{
	font-family: "Spotnik";
	font-size: 1em;
}

.glitch{
  color:white;
  position:relative;
  width:400px;
  margin:0 auto;
}
@keyframes noise-anim{
  $steps:20;
  @for $i from 0 through $steps{
    #{percentage($i* calc(1 / $steps))}{
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
  background: rgba(255,255,255, 0);
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim 2s infinite linear alternate-reverse;
}

@keyframes noise-anim-2{
  $steps:20;
  @for $i from 0 through $steps{
    #{percentage($i* calc(1 / $steps))}{
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
  background:rgba(255,255,255, 0);
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim-2 3s infinite linear alternate-reverse;
}
</style>
