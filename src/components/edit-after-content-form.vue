<script setup lang="ts">
import PollForm from './Voting/Form.vue'
import { ref } from 'vue'
import IconPoll from '../assets/images/icon-poll.svg'

const isOpened = ref<boolean>(false)

// when click button, open poll form
const onClickImage = () => {
	console.log('clicked')
	isOpened.value = true
}
</script>
<template>
	<PollForm :isOpened.sync="isOpened" />
	<button
		class="inline-flex cursor-pointer items-center rounded-full shadow-sm"
		type="button"
		@click="onClickImage"
	>
		<img class="w-7" :src="IconPoll.src" alt="paper-airplane" />
	</button>
</template>
