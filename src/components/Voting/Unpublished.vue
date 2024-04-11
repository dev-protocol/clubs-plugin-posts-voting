<script setup lang="ts">
import { onMounted } from 'vue'
import { Strings } from '../i18n'
import { i18nFactory } from '@devprotocol/clubs-core'

const i18nBase = i18nFactory(Strings)
let i18n = i18nBase(['en'])

onMounted(() => {
	i18n = i18nBase(navigator.languages)
})
</script>
<template>
	<div class="flex flex-col justify-center items-center p-4">
		<div class="px-8 py-4 border border-gray-400 text-center">
			<p class="text-xl text-gray-600 font-bold mb-2">
				{{ i18n('Unpublished') }}
			</p>
			<p class="text text-gray-600">
				{{ i18n('UnpublishedDetail') }}<br />{{ i18n('PleaseWait') }}
			</p>
		</div>
	</div>
</template>
