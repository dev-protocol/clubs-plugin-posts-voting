<script lang="ts" setup>
import type { Option } from '../../types.ts'
import type { OptionsDatabase, Posts } from '@devprotocol/clubs-plugin-posts'
import { type ClubsProfile, decode } from '@devprotocol/clubs-core'
import { onMounted, ref } from 'vue'
import Profile from '../Votes/Profile.vue'
import IconLock from '../../assets/images/icon-lock.png'
import { remark } from 'remark'
import strip from 'strip-markdown'

type Props = {
	options: Option[]
	feeds: OptionsDatabase[]
	postsPluginId: string
}
const props = defineProps<Props>()

const polls = ref<any[]>([])

const { postsPluginId, feeds } = props

type Polls = {
	title: string
	values: PostsPlus[]
}

type PostsPlus = Posts & {
	image: string
	profile: Promise<{
		readonly profile: ClubsProfile | undefined
		readonly error: Error | undefined
	}>
	stripedMarkdown: string
}

const feedId = ref('')

const fetchPolls = async (feed: OptionsDatabase): Promise<Polls> => {
	feedId.value = feed.id
	const title = feed.title

	const url = new URL(
		`/api/${postsPluginId}/${feedId.value}/search/has:option/%23poll`,
		window.location.origin,
	)

	const res = await fetch(url.toString())
	const json = await res.json()

	return {
		title: title ? title : feedId.value,
		values: decode(json.contents),
	}
}

onMounted(async () => {
	await Promise.all(
		feeds.map(async (feed) => {
			const data = await fetchPolls(feed)

			data.values = data.values.map((post) => {
				post.updated_at = new Date(post.updated_at).toLocaleString('ja-JP')

				const images = post.options.find((item) => item.key === '#images')
				if (images && images.value.length > 0) {
					post.image = images.value[0]
				}

				remark()
					.use(strip)
					.process(post.content)
					.then((text) => {
						post.stripedMarkdown = text.toString()
					})

				return post
			})

			polls.value = [...polls.value, data]
		}),
	)
})
</script>

<template>
	<div class="p-4">
		<div v-for="poll in polls" :key="poll.title">
			<h2 class="mb-4 text-xl">{{ poll.title }}</h2>
			<a
				v-for="post in poll.values"
				:key="post.id"
				:href="`/posts/${feedId}/${post.id}`"
				class="block mb-4 p-2 bg-gray-100 rounded"
			>
				<div class="flex justify-between gap-2">
					<div class="w-full">
						<p class="text-lg font-bold">Post_title: {{ post.title }}</p>
						<p class="mb-1 text-xs text-gray-400">{{ post.updated_at }}</p>
						<div class="flex justify-between gap-2">
							<Profile :address="post.created_by" />
							<p v-if="!post.masked" class="flex-grow flex-wrap text-lg truncate">
								{{ post.stripedMarkdown }}
							</p>
							<div
								v-else
								class="flex flex-col justify-center items-center flex-grow p-2 bg-gray-200 rounded"
							>
								<img
									class="mb-1 w-5"
									:src="IconLock.src"
									alt="paper-airplane"
								/>
								<p class="leading-none">Locked</p>
							</div>
						</div>
					</div>
					<figure v-if="!post.masked && post.image">
						<img
							:src="post.image"
							class="rounded max-w-20 max-h-20 object-cover object-center"
							alt="post image"
						/>
					</figure>
				</div>
			</a>
			<div v-if="poll.length < 1" class="mb-4 p-2 bg-gray-100 rounded">
				<p class="w-full text-gray-400 text-center">Empty :)</p>
			</div>
		</div>
	</div>
</template>
