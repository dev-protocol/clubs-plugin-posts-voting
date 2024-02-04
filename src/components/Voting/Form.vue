<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, toRefs, watch } from 'vue'
import { onUpdate } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import type { Poll } from '../../types.ts'

type Choice = {
	id: number
	message: string | undefined
}

// Choiceにvotesを追加
type ChoiceWithVotes = Choice & {
	votes: number
}

onUpdate((post) => {
	// optionsのpollにundefinedがある場合はreturnする
	if (options.value.some((option) => option.poll === undefined)) {
		return post
	}

	const poll: Poll = {
		options: options.value.map((option) => {
			return {
				id: option.id,
				title: option.poll,
			}
		}),
		publication: publication.value,
		expiration: {
			day: days.value,
			hours: hour.value,
			minutes: minute.value,
		},
	}

	const editedPost = {
		...post,
		options: [
			...post.options.filter((option) => option.key !== 'poll'),
			{
				key: 'poll',
				value: poll,
			},
		],
	}

	return editedPost
})

const options = ref([
	{ id: 1, poll: undefined },
	{ id: 2, poll: undefined },
])
const days = ref<number>(1)
const hour = ref<number>(0)
const minute = ref<number>(0)
const publication = ref(true)

const dayOptions = ref(Array.from({ length: 8 }, (_, index) => index))
const hourOptions = ref(Array.from({ length: 24 }, (_, index) => index))
const minuteOptions = ref(Array.from({ length: 60 }, (_, index) => index))

const MAX_OPTIONS = 4

const handleClickAddOption = () => {
	if (options.value.length >= MAX_OPTIONS) {
		return
	}

	options.value.push({
		id: options.value.length + 1,
		poll: undefined,
	})
}

const isPollOpen = ref(false)
const pollOptionsRef = ref(null)
const POLL_EVENT = 'onClickPollEvent'
const event = new CustomEvent('onClickPollEvent')

const togglePollState = () => {
	isPollOpen.value = !isPollOpen.value
}

onMounted(() => {
	window.addEventListener(POLL_EVENT, togglePollState)
})

onUnmounted(() => {
	window.removeEventListener(POLL_EVENT, togglePollState)
})

const handleClickRemovePoll = () => {
	if (isPollOpen.value === false) {
		return
	}

	window.dispatchEvent(event)
}

watch(isPollOpen, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			if (!pollOptionsRef.value) {
				return
			}

			const firstInput = pollOptionsRef.value as HTMLElement
			if (firstInput) {
				const el = firstInput.querySelector('input')
				if (!el) {
					return
				}
				el.focus()
			}
		})
	}
})
</script>
<template>
	<div
		v-if="isPollOpen"
		class="flex flex-col mb-4 border border-gray-400 rounded-lg overflow-hidden"
	>
		<div class="flex">
			<div ref="pollOptionsRef" class="flex flex-col gap-2 py-4 flex-grow">
				<div v-for="(option, index) in options" class="px-4">
					<label
						class="block mb-2 uppercase tracking-wide text-gray-400 text-xs font-bold"
						for="grid-last-name"
					>
						Choice {{ option.id }} {{ index > 1 ? '(optional)' : '' }}
					</label>
					<input
						v-model="option.poll"
						class="appearance-none block py-3 px-4 w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					/>
				</div>
			</div>
			<div
				v-if="options.length < MAX_OPTIONS"
				class="flex py-4 content-end items-end w-1/12"
			>
				<button
					class="py-3 px-4"
					style="color: transparent; text-shadow: 0 0 0 #3b82f6"
					@click="handleClickAddOption"
				>
					➕
				</button>
			</div>
		</div>
		<div class="py-4 px-4 border-t border-gray-400">
			<p class="mb-2 text-gray-400 font-bold">
				Immediate Result Publication Settings
			</p>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="publication" type="checkbox" class="sr-only peer" />
				<span
					class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				></span>
			</label>
		</div>
		<div class="py-4 px-4 border-t border-gray-400">
			<p class="text-gray-400 font-bold">Poll length</p>
			<div class="flex justify-between gap-6">
				<div class="w-1/3">
					<label class="text-gray-400">Days</label>
					<div class="relative">
						<select
							v-model="days"
							class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-state"
						>
							<option v-for="day in dayOptions">{{ day }}</option>
						</select>
						<div
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
						>
							<svg
								class="fill-current h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path
									d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
								/>
							</svg>
						</div>
					</div>
				</div>
				<div class="w-1/3">
					<label class="text-gray-400">Hours</label>
					<div class="relative">
						<select
							v-model="hour"
							class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-state"
						>
							<option v-for="hour in hourOptions">{{ hour }}</option>
						</select>
						<div
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
						>
							<svg
								class="fill-current h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path
									d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
								/>
							</svg>
						</div>
					</div>
				</div>
				<div class="w-1/3">
					<label class="text-gray-400">Minutes</label>
					<div class="relative">
						<select
							v-model="minute"
							class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-state"
						>
							<option v-for="min in minuteOptions">{{ min }}</option>
						</select>
						<div
							class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
						>
							<svg
								class="fill-current h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path
									d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="border-t border-gray-400">
			<button
				class="py-4 w-full border text-red-500"
				@click="handleClickRemovePoll"
			>
				Remove poll
			</button>
		</div>
	</div>
</template>
