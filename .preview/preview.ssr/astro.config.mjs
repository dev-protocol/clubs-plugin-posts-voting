import { defineConfig } from 'astro/config'
import clubs from '@devprotocol/clubs-core'
import vue from '@astrojs/vue'
import tailwind from '@astrojs/tailwind'
import svelte from '@astrojs/svelte'
import { config } from 'dotenv'

config({ path: './.env' })

export default defineConfig({
	output: 'server',
	integrations: [clubs(), vue(), tailwind(), svelte()],
	vite: {
		optimizeDeps: {
			include: ['dayjs'],
		},
	},
})
