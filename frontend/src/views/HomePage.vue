<template>
	<v-container>
    <v-row>
        <v-col cols="auto" sm="3" class="border">
        <div id='test' class="searchtool-one">
          <v-selection @open="getUsersList"
                @option:selected="goToUserPage"
                class="style-chooser"
                label="nickname"
                placeholder=" Users "
                :options="usersList"
          ></v-selection>
        </div>
      </v-col>
    </v-row>
		<particles-bg type="cobweb" :bg="true" />
		<v-img :aspect-ratio="16/9" height="500" src="../assets/42_Logo.svg"/>
		<v-row>
			<v-col align="center">
				<h1 class="text">The</h1>
				<h1 class="text">Game</h1>
				<v-btn elevation="24" outlined rounded min-height="100" min-width="200" color="rgb(255, 0, 0)" to="/game">
					<h1 class="text rainbow">Play</h1>
				</v-btn>
				<v-btn elevation="24" outlined rounded min-height="100" min-width="200" color="rgb(0, 0, 255)" to="/game?watch=true">
					<h1 class="text rainbow">Watch</h1>
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
import { defineComponent, ref } from "vue";
import router from "../router/index"
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { getUsers } from "../components/FetchFunctions"

export default defineComponent ({
	components: {
		ParticlesBg,
    'v-selection': vSelect,
	},
	setup(){
    let usersList = ref<any[]>([]);
    const currentUser = useStore().getters.whoAmI as any;
		onMounted(async() => {
		useStore().commit('setConnected' , await isLogged())
		})

		function goToWatch(){
			router.push("/game?watch=true")
		}

    async function getUsersList(){
      usersList.value = await getUsers();
    }

    function goToUserPage(user: {id: number, nickname: string}) {
      if (user.id == currentUser.id)
        router.push("/user")
      else
        router.push("/user/" + user.nickname);
    }

		return { goToWatch, usersList, getUsersList, goToUserPage };
	}
})
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
  font-size: 4em;
  position:relative;
  width:5em;
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
  text-shadow:-1px 0 rgba(0,0,0,0);
  top:0;
  color:white;
  background: rgba(0,0,0,0);
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
  background: rgba(0, 0, 0, 0);
  overflow:hidden;
  clip:rect(0,900px,0,0); 
  animation:noise-anim-2 3s infinite linear alternate-reverse;
}

</style>

<style type="css">
.searchtool-one {
  padding-bottom: 2%;
  position: absolute;
  width: 200px;
  height: 200px;
  left:10px;
  top:10px;
}
</style>

<style>
.style-chooser .vs__search::placeholder,
.style-chooser .vs__dropdown-toggle,
.style-chooser .vs__dropdown-menu {
  border: 3px double #EA25B5;
  color: #f6edf5;
  text-transform: full-size-kana;
  font-variant: small-caps;

  --vs-dropdown-color: #27a455 ;
  --vs-dropdown-option-color: #cc99cd;
  --vs-dropdown-bg: none;

   --vs-selected-bg: #04BBEC;
  --vs-selected-color: #FF82F4;

  --vs-search-input-color: #FF82F4;

  --vs-dropdown-option--active-bg: #0D3F7C;
  --vs-dropdown-option--active-color: #eeeeee;
}

.style-chooser .vs__clear,
.style-chooser .vs__open-indicator {
  fill: #394066;
}
</style>