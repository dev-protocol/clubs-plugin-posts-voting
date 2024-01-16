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

export const meta = {
	id: 'devprotocol:clubs:plugin:posts:voting',
	displayName: 'Voting',
	category: ClubsPluginCategory.Uncategorized,
	readme: Readme,
} satisfies ClubsPluginMeta

export const getApiPaths = (async () => {
	// const dbs = options.find(
	// 	({ key }: Readonly<{ key: string }>) => key === 'feeds',
	// )?.value as UndefinedOr<readonly OptionsDatabase[]>

	return [
		{
			paths: ['vote'],
			// This will be [POST] /api/devprotocol:clubs:plugin:posts:voting/vote
			method: 'GET',
			handler: async ({ url }) => {
				//const address = url.searchParams.get('address')
				//const postId = url.searchParams.get('postId')
				const vote = url.searchParams.get('vote')

				const res = `voted ${vote} ok!!`

				// Todo: 保存するにはどうすれば

				return new Response(JSON.stringify(res))
			},
		},
	]
}) satisfies ClubsFunctionGetApiPaths

export default {
	getSlots,
	meta,
	getApiPaths,
} satisfies ClubsFunctionPlugin
