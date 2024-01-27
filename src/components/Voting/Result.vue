<script setup lang="ts">
// propsを受け取る
import type { Poll, PollOption } from '../../types.ts'

const props = defineProps<{
	poll: Poll
	address: string | undefined
}>()

const isVoter = (option: PollOption, address: string | undefined) => {
	if (address === undefined) return false
	return option.voters.includes(address)
}

const totalVotes = (options: PollOption[]) => {
	return options.reduce((acc, option) => {
		return acc + option.voters.length
	}, 0)
}

const calculatePercent = (votes: number, total: number) => {
	return Math.round((votes / total) * 100)
}
</script>
<template>
	<div class="flex flex-col gap-2 mb-4">
		<div v-for="option in poll.options" class="relative flex justify-between">
			<div class="pl-2 flex items-center gap-1 z-10">
				<div class="font-bold">{{ option.title }}</div>
				<div v-if="isVoter(option, address)">✓</div>
			</div>
			<div class="pr-2 font-bold z-10">
				{{ calculatePercent(option.voters.length, totalVotes(poll.options)) }}%
			</div>
			<div
				class="absolute bg-blue-300 h-full rounded"
				:style="`width: ${calculatePercent(
					option.voters.length,
					totalVotes(poll.options),
				)}%`"
			></div>
		</div>
	</div>
	<p>{{ totalVotes(poll.options) }} votes</p>
</template>
