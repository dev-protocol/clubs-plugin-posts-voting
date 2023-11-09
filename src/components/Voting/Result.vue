<script setup lang="ts">
// propsを受け取る
const props = defineProps<{
	vote: {
		selected: number
		options: {
			id: number
			name: string
			votes: number
		}[]
	}
}>()

const totalVotes = (
	options: {
		id: number
		name: string
		votes: number
	}[],
) =>
	options.reduce((acc, cur) => {
		return acc + cur.votes
	}, 0)

const calculatePercent = (votes: number, total: number) => {
	return Math.round((votes / total) * 100)
}
</script>
<template>
	<div class="flex flex-col gap-2 mb-4">
		<div v-for="option in vote.options" class="relative flex justify-between">
			<div class="pl-2 flex items-center gap-1 z-10">
				<div class="font-bold">{{ option.name }}</div>
				<div v-if="option.id === vote.selected">✓</div>
			</div>
			<div class="pr-2 font-bold z-10">
				{{ calculatePercent(option.votes, totalVotes(vote.options)) }}%
			</div>
			<div
				class="absolute bg-blue-300 h-full rounded"
				:style="`width: ${calculatePercent(
					option.votes,
					totalVotes(vote.options),
				)}%`"
			></div>
		</div>
	</div>
	<p>{{ totalVotes(vote.options) }} votes</p>
</template>
