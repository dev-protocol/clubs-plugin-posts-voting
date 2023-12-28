<script setup lang="ts">
import PollForm from './Voting/Form.vue'
import { onMounted, ref } from 'vue'
import IconPoll from '../assets/images/icon-poll.svg'
import IconPollDisabled from '../assets/images/icon-poll-disabled.svg'
import {onUpdate} from '@devprotocol/clubs-plugin-posts/plugin-helper';

const isOpened = ref<boolean>(false)

// when click button, open poll form

const event = new CustomEvent('onClickPollEvent')

const onClickImage = () => {
	if (isOpened.value === false) {
		window.dispatchEvent(event)
	}
}

onUpdate((post) => {
	return {
		...post,
		options:{
			...post.options.filter((option) => option.key !== 'poll'),
			key: 'poll',
			value: {
				options: [
					{
						id: 1,
						message: '芽田水浄水場の老朽化対策工事',
					},
					{
						id: 2,
						message: '給水所の増強工事',
					},
				],
				length: {
					days: 0,
					hours: 0,
					minutes: 0,
				},
			}
		}
	}
})


onMounted(() => {
	console.log('onMounted!!!!!')

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
