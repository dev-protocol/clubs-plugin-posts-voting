<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'

const section = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)

const vote = {
	selected: 1,
	total: 818,
	options: [
		{
			id: 1,
			name: 'Nizi',
			percent: 60.9,
		},
		{
			id: 2,
			name: 'SEVENTEEN',
			percent: 17.8,
		},
		{
			id: 3,
			name: 'TAEMIN',
			percent: 17.5,
		},
		{
			id: 4,
			name: 'JUNGKOOK',
			percent: 3.8,
		}]
}

onMounted(() => {
	if (!section.value) {
		return
	}

	currentPost((data) => {
		isMasked.value = data.masked
	}, section.value)
})
</script>
<template>
	<section v-if="isMasked !== true" ref="section">
		<div class="flex flex-col gap-2 mb-4">
			<div v-for="option in vote.options" class="relative flex justify-between">
				<div class="pl-2 flex items-center gap-1 z-10">
					<div class="font-bold">{{ option.name }}</div>
					<div v-if="option.id === vote.selected">✓</div>
				</div>
				<div class="pr-2 font-bold z-10">{{ option.percent }}%</div>
				<div
					class="absolute bg-blue-300 h-full rounded"
					:style="`width: ${option.percent}%`"
				></div>
			</div>
		</div>
		<p>{{ vote.total }} votes</p>
	</section>
</template>
