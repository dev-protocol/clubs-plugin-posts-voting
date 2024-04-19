<script lang="ts" setup>

import type {Option} from '../../types.ts';
import type {OptionsDatabase} from '@devprotocol/clubs-plugin-posts';
import {decode} from '@devprotocol/clubs-core';
import {onMounted, ref} from 'vue';

type Props = {
	options: Option[]
	feeds: OptionsDatabase[]
}
const props = defineProps<Props>()

const polls = ref([])
const error = ref('')
const isLoading = ref(true)

const fetchPolls = async () => {
  // これでPollのFeedをとってくる
	// http://localhost:4321/api/devprotocol:clubs:plugin:posts/default-2/search/has:option/%23poll

	const url = new URL(
		`/api/devprotocol:clubs:plugin:posts/default-2/search/has:option/%23poll`,
		window.location.origin,
	)

	fetch(url.toString())
		.then(async (res) => {
			console.log('res', res.status)
			if (res.status === 200) {
				const json = await res.json()
				polls.value = decode(json.contents)
			}
		})
		.catch((err) => {
			console.error(err)
			error.value =
				'Sorry, but there was an error loading the timeline. Please try again later.'
		})
		.finally(() => {
			isLoading.value = false
		})
}

onMounted(async () => {
	await fetchPolls()
	console.log('mounted', polls.value)
})

</script>

<template>
	<h1>Votes2</h1>
</template>
