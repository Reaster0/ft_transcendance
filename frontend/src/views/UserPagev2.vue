<template>
<div>
	<v-row justify="end">
		<v-col class="button_slick search_field" cols="5">
			<v-text-field label="UserName" v-model="userSearch"></v-text-field>
			<div class="button_slick button_slide Spotnik" @click="goSearchUser(userSearch)">Search</div>
		</v-col>
	</v-row>
	<v-container fluid>
		<div v-if="user && user.statusCode != 404">
			<particles-bg type="cobweb" :bg="true"/>
			<v-row>
				<v-col class="center">
					<div class="overlay width-65">
						<v-col v-if="!edit" align="center">
							<v-img :src="avatar" max-width="300px"/>
							<h1 class="overflow-x-auto">{{nickname}}</h1>
							<h1 class="overflow-x-auto">{{user.eloScore}}📈</h1>
							<h1 class="button_slick rainbow" data-text="playing" v-if="user.status == 'playing'" @click="goSeeMatch(user.nickname)">{{user.status}}</h1>
							<h1 v-else>{{user.status}}</h1>
							<div v-if="!route.params.username" class="button_slick button_slide Spotnik" @click="edit = !edit">Edit</div>
							<div v-if="!route.params.username" class="button_slick button_slide Spotnik" @click="redirFriends">Friends</div>
							<div v-if="route.params.username && !isFriend" class="button_slick button_slide Spotnik" @click="addMyFriend(user.nickname ,nickname)">Add Friend</div>
							<div v-if="route.params.username && isFriend" class="button_slick Spotnik">Added as friend</div>
						</v-col>
						<v-col v-else align="center">
							<v-btn color="#0D3F7C" icon="mdi-cloud-upload" min-height="215px" width="215px" @click="imgUp"></v-btn>
							<h1 v-if="!img_accepted" class="error_msg Spotnik">Img Too Big</h1>
							<input v-show="0" type="file" accept="image/*" id="upload" @change="imgReceived"/>
							<div class="field_slick big_button">
								<v-text-field label="nickname" v-model="nickname"/>
								<h1 v-if="!name_accepted" class="error_msg Spotnik">Choose another nickname</h1>
							</div>
							<div v-if="user && !user.is2FAEnabled" class="button_slick button_slide center Spotnik" @click="redirTwoAuth">Enable Two Factor Auth</div>
							<div v-else class="button_slick button_slide center Spotnik" @click="disable2FA">Disable Two Factor Auth</div>
							<div class="button_slick button_slide big_button Spotnik" @click="edit = !edit">Go Back</div>
						</v-col>
					</div>
				</v-col>
				<v-col  class="center">
				<div class="overlay width-85">
					<v-col class="overflow-y-auto" style="max-height: 500px" v-if="gameHistory" align-self="start">
						<div class="historyText loseText">LOST</div>
						<div class="historyText loseText" v-for="(score, index) in gameHistory.lost.infos.score" :key="score">You {{score}} {{gameHistory.lost.infos.opponent[index]}} {{gameHistory.lost.infos.opponentScore[index]}}</div>
					</v-col>
					<v-col class="overflow-y-auto" style="max-height: 500px" v-if="gameHistory" align-self="start">
						<div class="historyText winText">WIN</div>
						<div class="historyText winText" v-for="(score, index) in gameHistory.won.infos.score" :key="score">You {{score}} {{gameHistory.won.infos.opponent[index]}} {{gameHistory.won.infos.opponentScore[index]}}</div>
					</v-col>
					</div>
				</v-col>
		</v-row>
		</div>
		<div v-else>
			<v-row justify="center">
				<h1 class="field_slick big_button">User not found</h1>
			</v-row>
		</div>
	</v-container>
</div>
</template>

<script lang="ts">

import { useRoute } from "vue-router"
import { useStore, Store } from "vuex"
import { onMounted } from "@vue/runtime-core"
import { ref, watch, defineComponent } from "vue"
import { getAvatarID, getHistoryID, disableTwoFA } from "../components/FetchFunctions"
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue
import { updateUser, uploadAvatar, getUserInfos, isMyFriend, addFriend } from "../components/FetchFunctions"
import router from '../router/index'

export default defineComponent ({
	components: {
		ParticlesBg
	},
	setup(){
		const user = ref<null | any>(null); 
		const avatar = ref<null | any>(null);
		const edit = ref<boolean>(false);
		const nickname = ref<string | null>(null);
		const name_accepted = ref<boolean>(true);
		const img_accepted = ref<boolean>(true);
		const gameHistory = ref<null | any>(null);
		const route = ref<null | any>(useRoute());
		const userSearch = ref<string>("");
		const store = useStore() as Store<any>;
		const isFriend = ref<boolean>(false);

		onMounted(async () => {
			if (route.value.query.first)
				edit.value = true
			if (route.value.params.username){
				console.log(route.value.params.username)
				user.value = await getUserInfos(route.value.params.username as string) as any;
				if (user.value.statusCode == 404)
					return
				avatar.value = await getAvatarID(user.value.id) as any;
				nickname.value = user.value.nickname as string;
				gameHistory.value = await getHistoryID(user.value.id) as any;
				isFriend.value = await isMyFriend(user.value.id)
			}
			else{
				user.value = await store.getters.whoAmI as any;
				console.log(user.value)
				nickname.value = user.value.nickname as string;
				avatar.value = await getAvatarID(user.value.id) as any;
				gameHistory.value = await getHistoryID(user.value.id) as any;
			}
		})

		function imgUp() {
			document.getElementById("upload")!.click()
		}

		async function disable2FA() {
			await disableTwoFA()
			user.value.is2FAEnabled = false
		}

		function redirTwoAuth() {
			router.push('/2auth')
		}

		function redirFriends(){
			router.push('/user/friends')
		}

		function goSearchUser(username: string) {
			router.push('/redirect?' + new URLSearchParams({url: ("/user/" + username)}))
		}

		function goSeeMatch(username: string) {
			router.push('/game?watch=true&user=' + username)
		}

		async function addMyFriend(myName: string, nickname: string | null) {
			if (nickname == null
			|| nickname === ""
			|| myName === nickname !
			) { return; }
			await addFriend(nickname)
			isFriend.value = true
		}

		async function imgReceived(e : any) {
			img_accepted.value = await uploadAvatar(e)
			if (img_accepted.value && user && user.value && user.value.id)
				avatar.value = await getAvatarID(user.value.id) as any
		}

		watch(nickname, async (newnick: any) => {
			name_accepted.value = await updateUser(newnick, user.value.nickname) as any; 
		})

		return {user,
		avatar,
		edit,
		nickname,
		name_accepted,
		imgUp,
		redirTwoAuth,
		imgReceived,
		img_accepted,
		gameHistory,
		redirFriends,
		route,
		userSearch,
		goSearchUser,
		isFriend,
		addMyFriend,
		disable2FA,
		goSeeMatch}
	}
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Rajdhani:300&display=swap');


.rainbow:hover {
cursor: pointer;
transition: text-shadow 1s;
text-shadow: 0.04em 0.04em #fc0049,
        0.08em 0.08em #fe8f01,
        0.12em 0.12em #fdf21f,
        0.16em 0.16em #3fdf4b,
        0.2em 0.2em #3462fe;
}

.width-force {
	width: 200px;
}

.big_button {  
  margin: 20px auto 0 auto;
}

.search_field{
	display: flex;
	max-height: 98px;
}

.field_slick {
  color: #FFF;
  border: 2px solid rgb(216, 2, 134);
  background-color: #162944;
  border-radius: 0px;
  padding: 18px 36px;
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: inset 0 0 0 0 #D80286;
  -webkit-transition: ease-out 0.4s;
  -moz-transition: ease-out 0.4s;
  transition: ease-out 0.4s;
}

.historyText{
	font-family: 'Rajdhani', sans-serif;
	// font-family: 'monospace';
	font-size: 300%;
	color: #FFF;
	text-align: center;
	margin-top: 20px;
}

.winText{
	color: rgb(0, 255, 0);
}

.loseText{
	color: rgb(255, 0 ,0);
}

h1{
	justify-self: center;
	font-size: 4em;
	font-weight: bold;
	font-family: 'Rajdhani', sans-serif;
	color: #04BBEC;
	// margin-left: 20%;
}

.error_msg{
	color: #D80286;
}

.center{
	display: flex;
	justify-content: center;
	margin-top: 2em;
	height: 100%;
}

.width-65{
	width: 65%;
}

.width-85{
	width: 100%;
}

.overlay {
  margin: 1em;
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(#00214A, 0.8);
  border-radius: 3rem;
  box-shadow: 0 0 0 8px rgba(#FF82F4, 0.2);
  filter:  drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.50));
}

</style>

<style lang="scss">

.overlay {
  margin: 1em;
  padding: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(#00214A, 0.8);
  border-radius: 3rem;
  box-shadow: 0 0 0 8px rgba(#FF82F4, 0.2);
  filter:  drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.50));
}

</style> 
