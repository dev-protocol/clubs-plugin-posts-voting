<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Vote from './Voting/Vote.vue'
import Result from './Voting/Result.vue'
import Form from './Voting/Form.vue'

const voting = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)

const vote = ref({
	selected: 0,
	options: [
		{
			id: 1,
			name: 'Nizi',
			votes: 3,
		},
		{
			id: 2,
			name: 'SEVENTEEN',
			votes: 2,
		},
		{
			id: 3,
			name: 'TAEMIN',
			votes: 1,
		},
		{
			id: 4,
			name: 'JUNGKOOK',
			votes: 0,
		},
	],
})

onMounted(() => {
	if (!voting.value) {
		return
	}

	currentPost((data) => {
		isMasked.value = data.masked
	}, voting.value)
})

const isVoted = () => {
	return vote.value.selected !== 0
}

const handleClickVote = (optionId: number) => {
	vote.value.selected = optionId
	vote.value.options = vote.value.options.map((option) => {
		if (option.id === optionId) {
			option.votes += 1
		}

		return option
	})
}
</script>
<template>
	<div v-if="isMasked !== true" ref="voting">
		<Form />
		<section v-if="!isVoted()" class="voting">
			<Vote :handleClickVote="handleClickVote" :vote="vote" />
		</section>
		<section v-else class="result">
			<Result :vote="vote" />
		</section>
	</div>
</template>
