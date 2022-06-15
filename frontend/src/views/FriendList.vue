<template>
  <div>
			<div class="button_slick">
				<v-text-field label="add Friend" v-model="friendName"></v-text-field>
				<div class="button_slick button_slide" @click="addFriend(friendName)">Add Friend</div>
			</div>
			<div class="button_slick">
				<v-text-field label="remove Friend" v-model="friendName"></v-text-field>
				<div class="button_slick button_slide" @click="removeFriend(friendName)">Remove Friend</div>
			</div>
		<v-col v-if="listFriends && userInfo">
				<div class="overlay" v-for="(user, index) in listFriends.friends.names" :key="user.names">
					<h1 class="text">{{user}}</h1>
					<h1 class="text">{{userInfo[user].eloScore}}</h1>
					<h1 class="text">{{listFriends.friends.status[index]}}</h1>
				</div>
		</v-col>
	</div>
</template>

<script lang="ts">
import { onMounted } from "@vue/runtime-core"
import { getFriendsList, addFriend, getUserInfos, removeFriend } from "../components/FetchFunctions"
import { ref, defineComponent } from "vue"

export default defineComponent ({
	setup(){
		const listFriends = ref<null | any>(null);
		const friendName = ref<string>("");
		const userInfo = ref<any | null>(null);

		onMounted(async () =>{
			console.log('getting friend list')
			listFriends.value = await getFriendsList()
			console.log("listfriend:::" + JSON.stringify(listFriends.value))
			if (listFriends.value.friends.names[0]){
				for(let nickname of listFriends.value.friends.names){
					const Info = await getUserInfos(nickname)
					console.log("INFOS:::" + JSON.stringify(Info))
					userInfo.value = {
					...userInfo.value,
					[Info.nickname]: {
						eloScore: Info.eloScore,
						id: Info.id,
					}
				}
				}
			}
			console.log("userInfo:::" + JSON.stringify(userInfo.value))
			})

		return {listFriends, addFriend, friendName, userInfo, removeFriend}
	}
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Rajdhani:300&display=swap');


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

.text{
	// justify-self: center;
	font-size: 4em;
	font-weight: bold;
	font-family: 'Rajdhani', sans-serif;
	color: #04BBEC;
	margin: 5%;
	// margin-left: 20%;
}

</style>
