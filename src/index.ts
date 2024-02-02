import type {
	ClubsFunctionGetApiPaths,
	ClubsFunctionGetSlots,
	ClubsFunctionPlugin,
	ClubsPluginMeta,
} from '@devprotocol/clubs-core'
import { ClubsPluginCategory } from '@devprotocol/clubs-core'
import Readme from './readme.astro'
import { SlotName } from '@devprotocol/clubs-plugin-posts'
import AfterContentForm from './components/edit-after-content-form.astro'
import AfterPostContent from './components/feed-after-post-content.astro'
import { votingHandler } from './ApiHandler.ts'

export const getSlots = (async () => {
	return [
		{
			slot: SlotName.PostsEditAfterContentForm,
			component: AfterContentForm,
		},
		{
			slot: SlotName.PostsFeedAfterPostContent,
			component: AfterPostContent,
		},
	]
}) satisfies ClubsFunctionGetSlots

export const meta: ClubsPluginMeta = {
	id: 'devprotocol:clubs:plugin:posts:voting',
	displayName: 'Voting',
	category: ClubsPluginCategory.Uncategorized,
	description:
		'Voting is a voting application that prioritizes ease of use. Users can create their own polls, allowing up to a maximum of four options. Once the voting period is over, the results can be immediately checked.',
	previewImages: [
		'./assets/images/voting-preview01.png',
		'./assets/images/voting-preview02.png',
		'./assets/images/voting-preview03.png',
	],
	readme: Readme,
} satisfies ClubsPluginMeta

export const getApiPaths = (async () => {
	return [
		{
			paths: ['vote'],
			// This will be [POST] /api/devprotocol:clubs:plugin:posts:message
			method: 'POST',
			handler: votingHandler,
		},
	]
}) satisfies ClubsFunctionGetApiPaths

export default {
	getSlots,
	meta,
	getApiPaths,
} satisfies ClubsFunctionPlugin
