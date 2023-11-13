<script setup lang="ts">
import { ref, onMounted } from 'vue'

const options = ref([1, 2])

const days = ref(Array.from({ length: 8 }, (_, index) => index))
const hours = ref(Array.from({ length: 24 }, (_, index) => index))
const minutes = ref(Array.from({ length: 60 }, (_, index) => index))

const MAX_OPTIONS = 4

const handleClickAddOption = () => {
	if (options.value.length >= MAX_OPTIONS) {
		return
	}

	options.value.push(options.value.length + 1)
}
</script>
<template>
	<div
		class="flex flex-col mb-4 border border-gray-400 rounded-lg overflow-hidden"
	>
		<div class="flex">
			<div class="flex flex-col gap-2 py-4 flex-grow">
				<div v-for="(option, index) in options" class="px-4">
					<label
						class="block mb-2 uppercase tracking-wide text-gray-400 text-xs font-bold"
						for="grid-last-name"
					>
						Choice {{ option }} {{ index > 1 ? '(optional)' : '' }}
					</label>
					<input
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
			<p class="text-gray-400 font-bold">Poll length</p>
			<div class="flex justify-between gap-6">
				<div class="w-1/3">
					<label class="text-gray-400">Days</label>
					<div class="relative">
						<select
							class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-state"
						>
							<option v-for="day in days">{{ day }}</option>
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
							class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-state"
						>
							<option v-for="hour in hours">{{ hour }}</option>
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
							class="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-state"
						>
							<option v-for="min in minutes">{{ min }}</option>
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
			<button class="py-4 w-full border text-red-500">Remove poll</button>
		</div>
	</div>
</template>
