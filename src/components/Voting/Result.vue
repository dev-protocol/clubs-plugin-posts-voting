<script setup lang="ts">
// propsを受け取る
import type { Poll } from '../../types.ts'
import type { Reactions } from '@devprotocol/clubs-plugin-posts'
import { totalVotes } from './utils'

const props = defineProps<{
	poll: Poll
	reactions: Reactions[]
	address: string | undefined
}>()

const isVoter = (
	id: number,
	reactions: Reactions[],
	address: string | undefined,
) => {
	if (address === undefined) return false

	const reaction = reactions.find((reaction) => {
		return Object(reaction).key === `:poll:#${id}`
	})

	if (reaction === undefined) return false

	return Object(reaction).value.includes(address)
}

const votes = (reactions: Reactions[], id: number) => {
	// reactionsの中からkeyが`:poll:#${id}`のものを取得する
	// そのvalueの長さを返す
	const result = reactions.find((reaction) => {
		return Object(reaction).key === `:poll:#${id}`
	})?.value.length

	return result ? result : 0
}

const calculatePercent = (votes: number, total: number) => {
	if (total === 0) return 0
	return Math.round((votes / total) * 100)
}
</script>
<template>
	<div class="flex flex-col gap-2 mb-4">
		<div v-for="option in poll.options" class="relative flex justify-between">
			<div class="pl-2 flex items-center gap-1 z-10">
				<div class="font-bold">{{ option.title }}</div>
				<div v-if="isVoter(option.id, reactions, address)">✓</div>
			</div>
			<div class="pr-2 font-bold z-10">
				{{
					calculatePercent(votes(reactions, option.id), totalVotes(reactions))
				}}%
			</div>
			<div
				class="absolute bg-blue-300 h-full rounded"
				:style="`width: ${
					calculatePercent(
						votes(reactions, option.id),
						totalVotes(reactions),
					) || 1
				}%`"
			></div>
		</div>
	</div>
</template>
