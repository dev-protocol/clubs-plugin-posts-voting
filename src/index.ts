import type {
	ClubsFunctionGetApiPaths, ClubsFunctionGetPagePaths,
	ClubsFunctionGetSlots,
	ClubsFunctionPlugin,
	ClubsPluginMeta,
} from '@devprotocol/clubs-core'
import { ClubsPluginCategory } from '@devprotocol/clubs-core'
import {type OptionsDatabase, SlotName} from '@devprotocol/clubs-plugin-posts'
import { votingHandler } from './ApiHandler'
import Icon from './assets/images/Voting.png'
import Preview1 from './assets/images/voting-preview01.png'
import Preview2 from './assets/images/voting-preview02.png'
import Preview3 from './assets/images/voting-preview03.png'
import Readme from './readme.astro'
import AfterContentForm from './components/edit-after-content-form.astro'
import AfterPostContent from './components/feed-after-post-content.astro'
import type {UndefinedOr} from '@devprotocol/util-ts';
import Votes from './Pages/Votes.astro'

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
	icon: Icon,
	previewImages: [Preview1, Preview2, Preview3],
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

const getPagePaths = (async (
	options,
	{propertyAddress, adminRolePoints, rpcUrl},
	{getPluginConfigById}
) => {

	const [postsPlugin] = getPluginConfigById('devprotocol:clubs:plugin:posts')

	const feeds = postsPlugin?.options?.find(
		({key}: Readonly<{ readonly key: string }>) => key === 'feeds',
	)?.value as UndefinedOr<readonly OptionsDatabase[]>

	const props = {
		options,
		propertyAddress,
		adminRolePoints,
		rpcUrl,
		feeds,
	}

	return [{
		paths: ["votes"],
		component: Votes,
		props: {
			...props
		},
	}]
}) satisfies ClubsFunctionGetPagePaths

export default {
	getSlots,
	meta,
	getApiPaths,
	getPagePaths,
} satisfies ClubsFunctionPlugin
