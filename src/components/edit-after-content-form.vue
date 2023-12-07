<script setup lang="ts">
import PollForm from './Voting/Form.vue'
import { onMounted, ref } from 'vue'
import IconPoll from '../assets/images/icon-poll.svg'
import IconPollDisabled from '../assets/images/icon-poll-disabled.svg'

const isOpened = ref<boolean>(false)

// when click button, open poll form

const event = new CustomEvent('onClickPollEvent')

const onClickImage = () => {
	if (isOpened.value === false) {
		window.dispatchEvent(event)
	}
}

onMounted(() => {
	window.addEventListener('onClickPollEvent', () => {
		window.removeEventListener('onClickPollEvent', () => {})

		isOpened.value = !isOpened.value
	})
})
</script>
<template>
	<PollForm />
	<button
		class="inline-flex items-center rounded-full shadow-sm"
		:class="[isOpened ? 'cursor-default' : 'cursor-pointer']"
		type="button"
		@click="onClickImage"
	>
		<img
			class="w-7"
			:src="isOpened === false ? IconPoll.src : IconPollDisabled.src"
			alt="paper-airplane"
		/>
	</button>
</template>
