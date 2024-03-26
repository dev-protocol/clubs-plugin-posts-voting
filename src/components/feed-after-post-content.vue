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
import {
	isExpired,
	isOwner,
	isVoted,
	remainingTime,
	totalVotes,
} from './Voting/utils.ts'
import Unpublished from './Voting/Unpublished.vue'

const props = defineProps(['slotId', 'feedId'])

const voting = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)
const currentPostInfo = ref<any>()
const currentPoll = ref<Poll>()
const currentReaction = ref<any>()
const address = ref<string | undefined>(undefined)

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

		if (!currentPostInfo.value) {
			return
		}

		const pollOption = currentPostInfo.value.options.find(
			(option: any) => option.key === '#poll',
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
	}, voting.value)
})

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
			data: pollId,
			hash,
			sig,
		}),
	}

	const res = await fetch(
		`/api/devprotocol:clubs:plugin:posts/${props.feedId}/reactions`,
		requestInfo,
	)

	if (res.status === 200) {
		currentReaction.value = [
			...currentReaction.value,
			{
				key: pollId,
				value: currentReaction.value[pollId]
					? [...currentReaction.value[pollId], address.value]
					: [address.value],
			},
		]
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
					!isOwner(currentPostInfo.created_by, address) &&
					!isVoted(currentReaction, address) &&
					!isExpired(
						currentPostInfo.created_at,
						currentPoll.expiration.day,
						currentPoll.expiration.hours,
						currentPoll.expiration.minutes,
					)
				"
				class="mb-0.5 voting"
			>
				<Vote
					:handleClickVote="handleClickVote"
					:poll="currentPoll"
					:postId="currentPostInfo.id"
					:createdAt="currentPostInfo.created_at"
				/>
			</section>
			<section v-else class="result">
				<Unpublished
					v-if="
						!isOwner(currentPostInfo.created_by, address) &&
						!currentPoll.publication &&
						!isExpired(
							currentPostInfo.created_at,
							currentPoll.expiration.day,
							currentPoll.expiration.hours,
							currentPoll.expiration.minutes,
						)
					"
				/>
				<Result
					v-else
					:poll="currentPoll"
					:reactions="currentReaction"
					:address="address"
				/>
			</section>
			<div class="flex justify-start items-center gap-2">
				<p>{{ totalVotes(currentReaction) }} votes</p>
				<p>
					{{
						remainingTime(
							currentPostInfo.created_at,
							currentPoll.expiration.day,
							currentPoll.expiration.hours,
							currentPoll.expiration.minutes,
						)
					}}
				</p>
			</div>
		</div>
	</div>
</template>
