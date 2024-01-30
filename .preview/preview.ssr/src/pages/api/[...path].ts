import { apiFactory } from '@devprotocol/clubs-core'
import config from '../../../../config'
import plugins from '../../../../plugins'

export const ALL = async (event) => {
	const { ALL } = apiFactory({
		config,
		plugins,
	})

	return ALL(event)
}
// export const { All } = apiFactory({
// 	config,
// 	plugins,
// })
