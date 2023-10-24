import self from '../src/index'
import theme from './theme'
import posts from '@devprotocol/clubs-plugin-posts'
import type { ClubsPluginMeta } from '@devprotocol/clubs-core'

export default [
	self,
	theme,
	posts,
	{
		meta: {
			id: 'devprotocol:clubs:simple-memberships',
		} as ClubsPluginMeta,
	},
]
