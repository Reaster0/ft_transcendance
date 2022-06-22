<template>
	<div>
		<v-row justify="end">
				<v-col class="button_slick search_field" cols="5">
					<v-text-field :error-messages="errorField" label="Add Friend" v-model="friendName"></v-text-field>
					<div class="button_slick button_slide Spotnik" @click="addAFriend(friendName)">Add</div>
				</v-col>
		</v-row>
		<v-row v-if="listFriends && userInfo" justify="center">
			<v-col cols="10" v-for="(user, index) in listFriends.friends.names" :key="user.names">
				<div class="overlay">
					<v-img class="clickable" min-width="15%" max-width="20%" v-if="userInfo[user]" :src="userInfo[user].avatar" @click="toUserPage(user)"></v-img>
					<h1 class="text">{{user}}</h1>
					<v-spacer></v-spacer>
					<h1 v-if="userInfo[user]" class="text">{{userInfo[user].eloScore}}📈</h1>
					<v-spacer></v-spacer>
					<h1 class="text">{{listFriends.friends.status[index]}}</h1>
					<v-spacer></v-spacer>
					<div class="button_slick button_slide Spotnik" @click="removeAFriend(user)">Remove</div>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<script lang="ts">
import { onMounted } from "@vue/runtime-core"
import { getFriendsList, addFriend, getUserInfos, removeFriend, getAvatarID } from "../components/FetchFunctions"
import { ref, defineComponent } from "vue"
import router from "../router/index"

export default defineComponent ({
	setup(){
		const listFriends = ref<null | any>(null);
		const friendName = ref<string>("");
		const userInfo = ref<any | null>(null);
		const errorField = ref("")

		onMounted(async () =>{
			refreshList()
		})

		async function refreshList() {
			listFriends.value = await getFriendsList()
			userInfo.value = null
			if (listFriends.value.friends.names[0]){
				for(let nickname of listFriends.value.friends.names){
					const Info = await getUserInfos(nickname)
					userInfo.value = {
					...userInfo.value,
					[Info.nickname]: {
						eloScore: Info.eloScore,
						id: Info.id,
						avatar: await getAvatarID(Info.id)
					}
				}}
			}
		}

		async function addAFriend(nickname: string){
			const ret = await addFriend(nickname)
			if (ret == 200){
				refreshList()
				friendName.value = ""
				errorField.value = ""
			}
			else if (ret == 404)
				errorField.value = "User not found"
			else if (ret == 400)
				errorField.value = "can't add this friend"
		}

		async function removeAFriend(nickname: string){
			await removeFriend(nickname)
			refreshList()
		}

		function toUserPage(nickname: string){
			router.push("/user/" + nickname)
		}

		return {listFriends, friendName, userInfo, addAFriend, removeAFriend, errorField, toUserPage}
	}
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Rajdhani:300&display=swap');

.error_msg{
	display: block;
}

.search_field{
	display: flex;
	max-height: 98px;
}

.text{
	font-size: 350%;
	font-weight: bold;
	font-family: 'Rajdhani', sans-serif;
	color: #04BBEC;
}

</style>
