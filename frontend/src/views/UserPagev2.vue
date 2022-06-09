<template>
<v-container fluid v-if="user">
	<particles-bg type="cobweb" :bg="true"/>
	<v-row>
		<v-col class="center">
			<div class="overlay width-65">
				<v-col v-if="!edit" align="center">
					<v-img :src="avatar" max-width="300px"/>
					<h1 class="overflow-x-auto">{{nickname}}</h1>
					<h1 class="overflow-x-auto">{{user.eloScore}}📈</h1>
					<div class="button_slick button_slide Spotnik" @click="edit = !edit">Edit</div>
				</v-col>
				<v-col v-else align="center">
					<v-btn color="#0D3F7C" icon="mdi-cloud-upload" min-height="215px" width="215px" @click="imgUp"></v-btn>
					<h1 v-if="!img_accepted" class="error_msg Spotnik">Img Too Big</h1>
					<input v-show="0" type="file" accept="image/*" id="upload" @change="imgReceived"/>
					<div class="field_slick big_button">
						<v-text-field label="nickname" v-model="nickname"/>
						<h1 v-if="!name_accepted" class="error_msg Spotnik">Choose another nickname</h1>
					</div>
					<div v-if="user && !user.is2FAEnabled" class="button_slick button_slide center Spotnik" @click="this.$router.push('/2auth')">Enable Two Factor Auth</div>
					<div v-else class="field_slick center Spotnik">Two Factor Auth Enabled</div>
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
			<v-col class="overflow-y-auto" style="max-height: 450px" v-if="gameHistory" align-self="start">
				<div class="historyText winText">WIN</div>
				<div class="historyText winText" v-for="(score, index) in gameHistory.won.infos.score" :key="score">You {{score}} {{gameHistory.won.infos.opponent[index]}} {{gameHistory.won.infos.opponentScore[index]}}</div>
			</v-col>
			</div>
		</v-col>
</v-row>
</v-container>
</template>

<script>
import { useStore } from "vuex"
import { onMounted } from "@vue/runtime-core"
import { ref, watch } from "vue"
import { getAvatarID, getHistoryID } from "../components/FetchFunctions"
import { ParticlesBg } from "particles-bg-vue"; //https://github.com/lindelof/particles-bg-vue
import { updateUser, uploadAvatar } from "../components/FetchFunctions"

export default {
	components: {
		ParticlesBg
	},
	setup(){
		const user = ref(null);
		const avatar = ref(null);
		const edit = ref(false);
		const nickname = ref(null);
		const name_accepted = ref(true);
		const img_accepted = ref(true);
		const gameHistory = ref(null);

		onMounted(async () => {
			const store = useStore()
			user.value = await store.getters.whoAmI;
			nickname.value = user.value.nickname
			avatar.value = await getAvatarID(user.value.id)
			gameHistory.value = await getHistoryID(user.value.id)
			// console.log(gameHistory.value)
			console.log(gameHistory.value['won'])
		})

		function imgUp() {
			document.getElementById("upload").click()
		}

		//TODO check type of e
		async function imgReceived(e) {
			img_accepted.value = await uploadAvatar(e)
			if (img_accepted.value && user && user.value && user.value.id)
				avatar.value = await getAvatarID(user.value.id)
		}

		watch(nickname, async (newnick) => {
			name_accepted.value = await updateUser(newnick)
		})

		return {user,
		avatar,
		edit,
		nickname,
		name_accepted,
		imgUp,
		imgReceived,
		img_accepted,
		gameHistory}
	}
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Rajdhani:300&display=swap');

.width-force {
	width: 200px;
}

.big_button {  
  margin: 20px auto 0 auto;
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
//   padding-bottom: 20%;
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
