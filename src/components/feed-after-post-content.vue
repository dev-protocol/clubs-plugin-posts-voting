<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Vote from './Voting/Vote.vue'
import Result from './Voting/Result.vue'
import { encode, decode } from '@devprotocol/clubs-core'
import { type UndefinedOr, whenDefined } from '@devprotocol/util-ts'
import type { Posts } from '@devprotocol/clubs-plugin-posts'
import type { Poll } from '../types.ts'
import { connection } from '@devprotocol/clubs-core/connection'

const props = defineProps(['slotId', 'feedId'])

const voting = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)
const currentPostInfo = ref<any>()
const currentPoll = ref<Poll>()
const address = ref<string | undefined>(undefined)

// Todo: 仮の投票結果
const selectedPost = {
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
						voters: ['0x262A038D0bc05B4112c7D58BBfd407810bcfE2aB'],
					},
					{
						id: 2,
						title: '給水所の増強工事',
						voters: ['0x1234', '0x1111'],
					},
				],
				expiration: {
					day: 2,
					hours: 0,
					minutes: 0,
				},
			},
		},
	],
	id: '77a72e7c-f085-5d80-a7de-2d8ff70eaffe',
	created_by: '0x262A038D0bc05B4112c7D58BBfd407810bcfE2aB',
	created_at: '2024-01-25T05:49:51.636Z',
	updated_at: '2024-01-25T05:49:51.636Z',
	comments: [],
	reactions: {},
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

	// Todo: idが77a72e7c-f085-5d80-a7de-2d8ff70eaffeだけ、currentPostInfoをselectedPostにする
	if (currentPostInfo.value?.id === '77a72e7c-f085-5d80-a7de-2d8ff70eaffe') {
		currentPostInfo.value = selectedPost
	}

	// optionsにpollがあるかどうかを確認する
	const pollOption = currentPostInfo.value.options.find(
		(option) => option.key === 'poll',
	)

	if (!pollOption) {
		return
	}

	currentPoll.value = pollOption.value as Poll
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

// 有効期限が切れているかどうかを確認する
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

const getLatestPosts = async (): Promise<Posts[] | undefined> => {
	const response = await fetch(
		`/api/devprotocol:clubs:plugin:posts/${props.feedId}/message`,
	)
	const json = await response.json()

	const posts: Posts[] | undefined = whenDefined(json.contents, (data) => {
		return decode(data)
	})

	return posts
}

const getLatestPollOption = async (
	latestPosts: Posts[],
	postId: string,
): Promise<Poll | undefined> => {
	// composedPostsの中からidがpostIdのoptionsを取得する
	const latestOptions = latestPosts?.find((post) => post.id === postId)?.options
	console.log('latestOptions', latestOptions)

	// latestOptionsからkeyがpollのものを取得する
	// const latestPoll = latestOptions?.find((option) => option.key === 'poll')

	// return latestPoll

	return {
		options: [
			{
				id: 1,
				title: '芽田水浄水場の老朽化対策工事',
				voters: [],
			},
			{
				id: 2,
				title: '給水所の増強工事',
				voters: [],
			},
		],
		expiration: {
			day: 1,
			hours: 1,
			minutes: 1,
		},
	}
}

const isVoted = (poll: Poll, address: string | undefined) => {
	if (!address) {
		return false
	}

	return poll.options.some((option) => option.voters.includes(address))
}

const handleClickVote = async (postId: string, optionId: number) => {
	if (!address.value) {
		return
	}

	// latestPostsを取得する
	const latestPosts = await getLatestPosts()
	if (!latestPosts) {
		return
	}
	// console.log('latestPosts', latestPosts)

	// optionsの最新の情報を取得する
	const latestPollOption = await getLatestPollOption(latestPosts, postId)

	// 投票済みかどうかを確認する
	if (latestPollOption && isVoted(latestPollOption, address.value)) {
		console.log('already voted')
		return
	}

	// latestPollOptionの中からidがoptionIdのoptionを取得する
	const selectedOption = latestPollOption?.options.find(
		(option) => option.id === optionId,
	)

	// selectedOptionのvotersにaddressを追加する
	selectedOption?.voters.push(address)

	// latestPollOptionの中からidがoptionIdのoptionを更新する
	const updatedOptions = latestPollOption?.options.map((option) => {
		if (option.id === optionId) {
			return selectedOption
		}
		return option
	})

	// latestPollOptionの中からidがoptionIdのoptionを更新する
	const updatedPoll = {
		...latestPollOption,
		options: updatedOptions,
	}

	// latestPostsの中からidがpostIdのoptionsを取得する
	const updatedPosts = latestPosts.map((post) => {
		if (post.id === postId) {
			return {
				...post,
				options: [
					...post.options.filter((option) => option.key !== 'poll'),
					{
						key: 'poll',
						value: updatedPoll,
					},
				],
			}
		}
		return post
	})
	console.log('updatedPosts', updatedPosts)

	// Todo: 投票結果を保存するためにfetchする

	// 投票結果をfetchする
	// const requestInfo = {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		feedId: props.feedId,
	// 		vote: optionId,
	// 		hash,
	// 		sig,
	// 	}),
	// }
	//
	// const res = await fetch(
	// 	`/api/devprotocol:clubs:plugin:posts:voting/vote`,
	// 	requestInfo,
	// )
	//
	// if (res.status === 200) {
	// 	// 投票結果を取得する
	// 	const data = await res.json()
	// 	console.log(data)
	//
	// 	vote.value.selected = optionId
	// 	vote.value.options = vote.value.options.map((option) => {
	// 		if (option.id === optionId) {
	// 			option.votes += 1
	// 		}
	//
	// 		return option
	// 	})
	// } else {
	// 	console.error('Error occurred while posting voting:', res)
	// }
}
</script>
<template>
	<div v-if="isMasked !== true" ref="voting">
		<div v-if="currentPoll">
			<section
				v-if="
					!isVoted(currentPoll, address) &&
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
				<Result :poll="currentPoll" :address="address" />
			</section>
		</div>
	</div>
</template>
