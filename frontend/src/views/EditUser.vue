<template>
	<v-container v-if="user">
		<v-row justify="center">
			<v-col cols="12" sm="10" md="8" lg="6">
				<v-card>
					<v-card-text>
						<v-text-field label="nickname" v-model="nickname.value"></v-text-field>
				</v-card-text>
					<v-row justify="center">
						<v-btn @click="sendUpdate">Update</v-btn>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import { useStore } from "vuex"
import { onMounted, reactive } from "@vue/runtime-core"
import { ref } from "vue"
import { updateUser } from "../components/FetchFunctions"

export default {
	setup(){
		const user = ref(null)

		const nickname = reactive({
			value: ""
		})

		onMounted(async () => {
		user.value = useStore().getters.whoAmI;
		nickname.value = user.value.nickname
		})

		async function sendUpdate(){
			console.log("result =" + await updateUser(nickname.value))
		}

		return {user, nickname, sendUpdate}
	}
}
</script>

<style>

</style>
