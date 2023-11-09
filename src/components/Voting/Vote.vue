<script setup lang="ts">
// propsを受け取る
const props = defineProps<{
	handleClickVote: (id: number) => void
	vote: {
		selected: number
		options: {
			id: number
			name: string
			votes: number
		}[]
	}
}>()
</script>
<template>
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
</template>
