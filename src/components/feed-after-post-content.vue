<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Vote from './Voting/Vote.vue'
import Result from './Voting/Result.vue'
import { encode, decode } from '@devprotocol/clubs-core'
import { type UndefinedOr, whenDefined } from '@devprotocol/util-ts'
import type { Posts, Reactions } from '@devprotocol/clubs-plugin-posts'
import type { Poll } from '../types.ts'
import { connection } from '@devprotocol/clubs-core/connection'

const props = defineProps(['slotId', 'feedId'])

const voting = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)
const currentPostInfo = ref<any>()
const currentPoll = ref<Poll>()
const currentReaction = ref<any>()
const address = ref<string | undefined>(undefined)

// Todo: delete this after testing
const dummyPost = {
	id: '77a72e7c-f085-5d80-a7de-2d8ff70eaffe',
	created_by: '0x262A038D0bc05B4112c7D58BBfd407810bcfE2aB',
	created_at: '2024-01-25T05:49:51.636Z',
	updated_at: '2024-01-25T05:49:51.636Z',
	comments: [],
	title: 'aacv',
	content: '',
	options: [
		{
			key: 'require-one-of',
			value: [],
		},
		{
			key: '#images',
			value: [],
		},
		{
			key: 'poll',
			value: {
				options: [
					{
						id: 1,
						title: '芽田水浄水場の老朽化対策工事',
					},
					{
						id: 2,
						title: '給水所の増強工事',
					},
				],
				expiration: {
					day: 1,
					hours: 0,
					minutes: 0,
				},
			},
		},
	],
	reactions: {
		':poll:#1': ['0x0000', '0x1111'],
		':poll:#2': ['0x262A038D0bc05B4112c7D58BBfd407810bcfE2aB'],
	},
}

connection().account.subscribe((_account: string | undefined) => {
	address.value = _account
})

onMounted(async () => {
	if (!voting.value) {
		return
	}

	currentPost((data: Posts) => {
		currentPostInfo.value = data

		isMasked.value = data.masked
	}, voting.value)

	if (!currentPostInfo.value) {
		return
	}

	// Todo: set dummyPost to currentPostInfo.value
	if (currentPostInfo.value?.id === '77a72e7c-f085-5d80-a7de-2d8ff70eaffe') {
		currentPostInfo.value = dummyPost
	}

	const pollOption = currentPostInfo.value.options.find(
		(option: any) => option.key === 'poll',
	)

	if (!pollOption) {
		return
	}

	currentPoll.value = pollOption.value as Poll

	currentReaction.value = Object.keys(currentPostInfo.value.reactions)
		.filter((key) => key.includes(':poll:'))
		.map((key) => {
			return {
				key,
				value: currentPostInfo.value.reactions[key],
			}
		})
})

const getExpirationTime = (
	createdAt: string,
	day: number,
	hours: number,
	minutes: number,
) => {
	const createdDate = new Date(createdAt)
	const expirationDate = new Date(
		createdDate.getFullYear(),
		createdDate.getMonth(),
		createdDate.getDate() + day,
		createdDate.getHours() + hours,
		createdDate.getMinutes() + minutes,
	)

	return expirationDate
}

const isExpired = (
	createdAt: string,
	day: number,
	hours: number,
	minutes: number,
) => {
	const expirationTime = getExpirationTime(createdAt, day, hours, minutes)
	const now = new Date()
	return now > expirationTime
}

const isVoted = (reactions: Reactions[], address: string | undefined) => {
	if (!address) {
		return false
	}

	return reactions.some((reaction) => {
		return Object(reaction).value.includes(address)
	})
}

const handleClickVote = async (postId: string, optionId: number) => {
	const signer = (
		await import('@devprotocol/clubs-core/connection')
	).connection().signer.value

	if (!signer) {
		return
	}

	const pollId = `:poll:#${optionId}`
	const hash = encode(`${postId}-${pollId}`)

	let sig: UndefinedOr<string>
	try {
		sig = await signer.signMessage(hash)
	} catch (error) {
		console.error('error occurred while signing message:', error)
		return
	}

	const requestInfo = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			postId,
			pollId,
			hash,
			sig,
		}),
	}

	const res = await fetch(
		`/api/devprotocol:clubs:plugin:posts/${props.feedId}/reactions`,
		requestInfo,
	)

	if (res.status === 200) {
		// Todo: CurrentReactionを更新する（動作確認必要）
		currentReaction.value.find((reaction: Reactions) => {
			if (reaction.key === pollId) {
				reaction.value.push(address.value)
			}
		})
	} else {
		console.error('Error occurred while posting voting:', res)
	}
}
</script>
<template>
	<div v-if="isMasked !== true" ref="voting">
		<div v-if="currentPoll">
			<section
				v-if="
					!isVoted(currentReaction, address) &&
					!isExpired(
						currentPostInfo.created_at,
						currentPoll.expiration.day,
						currentPoll.expiration.hours,
						currentPoll.expiration.minutes,
					)
				"
				class="voting"
			>
				<Vote :handleClickVote="handleClickVote" :poll="currentPoll" />
			</section>
			<section v-else class="result">
				<Result
					:poll="currentPoll"
					:reactions="currentReaction"
					:address="address"
				/>
			</section>
		</div>
	</div>
</template>
