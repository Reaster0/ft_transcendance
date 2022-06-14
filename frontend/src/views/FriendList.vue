<template>
  <div>
	<div class="overlay">
		<v-row>
			<div class="button_slick">
				<v-text-field label="add Friend" v-model="friendName"></v-text-field>
				<div class="button_slick button_slide" @click="addFriend(friendName)">Add Friend</div>
			</div>
		</v-row>
	</div>
  </div>
</template>

<script lang="ts">
import { onMounted } from "@vue/runtime-core"
import { getFriendsList, addFriend } from "../components/FetchFunctions"
import { ref, defineComponent } from "vue"

export default defineComponent ({
	setup(){
		const friendName = ref<string>('')
		// const listFriends = ref<null | any>(null);

		onMounted(async () =>{
			console.log('getting friend list')
			const friendsList = await getFriendsList()
			console.log(friendsList)
			})

		return {friendName, addFriend}
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
</style>