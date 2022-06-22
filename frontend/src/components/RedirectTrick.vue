<template>
<div></div>
</template>

<script>
import { useRoute } from "vue-router"
import router from '../router/index'

export default {
	setup(){
		router.push(useRoute().query.url.toString())
	}

}
</script>

<style>

</style>