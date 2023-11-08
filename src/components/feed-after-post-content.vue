<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'

const section = ref<Element>()
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

onMounted(() => {
	if (!section.value) {
		return
	}

	currentPost((data) => {
		isMasked.value = data.masked
	}, section.value)
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
	<section v-if="isMasked !== true" ref="section">
		<section v-if="!isVoted()" class="voting">
			<ul class="flex flex-col gap-1">
				<li v-for="option in vote.options" :key="option.id" class="list-none">
					<button
						class="w-full text-blue-500 font-bold border border-blue-500 rounded-xl"
						@click="
							() => {
								handleClickVote(option.id)
							}
						"
					>
						{{ option.name }}
					</button>
				</li>
			</ul>
		</section>
		<section v-else class="result">
			<div class="flex flex-col gap-2 mb-4">
				<div
					v-for="option in vote.options"
					class="relative flex justify-between"
				>
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
		</section>
	</section>
</template>
