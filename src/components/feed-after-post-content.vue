<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Vote from './Voting/Vote.vue'
import Result from './Voting/Result.vue'
import { encode } from '@devprotocol/clubs-core'
import type { UndefinedOr } from '@devprotocol/util-ts'

const props = defineProps(['slotId', 'feedId'])

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
	// addressを取得する
	const signer = (
		await import('@devprotocol/clubs-core/connection')
	).connection().signer.value

	// Todo: これだと同じ選択肢を選んだ人でhashが一緒になってしまうが変更した方が良いかも？
	const hash = encode(`${props.feedId}-${optionId}`)

	let sig: UndefinedOr<string>
	try {
		// ここでユーザーには署名の許可を求めるUIが出る
		sig = await signer.signMessage(hash)
	} catch (error) {
		// 署名の許可をもらえなかった場合
		console.error('error occurred while signing message:', error)
		return
	}

	// 投票結果をfetchする
	const requestInfo = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			feedId: props.feedId,
			vote: optionId,
			hash,
			sig,
		}),
	}

	const res = await fetch(
		`/api/devprotocol:clubs:plugin:posts:voting/vote`,
		requestInfo,
	)

	if (res.status === 200) {
		// 投票結果を取得する
		const data = await res.json()
		console.log(data)

		vote.value.selected = optionId
		vote.value.options = vote.value.options.map((option) => {
			if (option.id === optionId) {
				option.votes += 1
			}

			return option
		})
	} else {
		console.error('Error occurred while posting voting:', res)
	}
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
