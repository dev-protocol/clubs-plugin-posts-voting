<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Vote from './Voting/Vote.vue'
import Result from './Voting/Result.vue'

const voting = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)

const vote = ref({
	selected: 0,
	options: [
		{
			id: 1,
			name: '芽田水浄水場の老朽化対策工事',
			votes: 312,
		},
		{
			id: 2,
			name: '給水所の増強工事',
			votes: 400,
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

const handleClickVote = async (optionId: number) => {
	vote.value.selected = optionId
	vote.value.options = vote.value.options.map((option) => {
		if (option.id === optionId) {
			option.votes += 1
		}

		return option
	})

	// Todo: feedIDとAddressを送らないとどれに投票するかわからないような気がする

	// 投票結果をfetchする
	const res = await fetch(
		`/api/devprotocol:clubs:plugin:posts:voting/vote?postId=&vote=${optionId}`,
	)

	// 投票結果を取得する
	const data = await res.json()
	console.log(data)
}
</script>
<template>
	<div v-if="isMasked !== true" ref="voting">
		<section v-if="!isVoted()" class="voting">
			<Vote :handleClickVote="handleClickVote" :vote="vote" />
		</section>
		<section v-else class="result">
			<Result :vote="vote" />
		</section>
	</div>
</template>
