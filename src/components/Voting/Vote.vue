<script setup lang="ts">
import type { Poll } from '../../types.ts'

// propsを受け取る
const props = defineProps<{
	handleClickVote: (postId: string, optionId: number) => void
	poll: Poll
	postId: string
}>()
</script>
<template>
	<ul class="flex flex-col gap-1">
		<li v-for="option in poll.options" :key="option.id" class="list-none">
			<button
				class="w-full text-blue-500 font-bold border border-blue-500 rounded-xl"
				@click="
					() => {
						handleClickVote(postId, option.id)
					}
				"
			>
				{{ option.title }}
			</button>
		</li>
	</ul>
</template>
