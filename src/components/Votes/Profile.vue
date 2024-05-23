<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ZeroAddress } from 'ethers'
import { Avatar } from '@boringer-avatars/vue3'
import { fetchProfile } from '@devprotocol/clubs-core'

type Props = {
	address: string
}

const props = defineProps<Props>()

const avatar = ref('')
const name = ref('')

onMounted(() => {
	if (!props.address || props.address === ZeroAddress) {
		name.value = truncateEthAddress(props.address)
		return
	}

	// fetch profile
	getProfile(props.address)
})

const truncateEthAddress = (address: string) => {
	const match = address.match(
		/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/,
	)
	if (!match) return address
	return `${match[1]}\u2026${match[2]}`
}

const getProfile = async (address: string) => {
	const res = await fetchProfile(address)
	if (res?.error) {
		console.error(res.error)
		return
	}

	avatar.value = res?.profile?.avatar || ''
	name.value = res?.profile?.username ?? truncateEthAddress(address)
}
</script>

<template>
	<div class="">
		<template v-if="avatar">
			<div
				class="h-8 w-8 rounded-full bg-cover bg-center bg-no-repeat"
				:style="`background-image: url(${avatar})`"
			/>
		</template>
		<template v-else>
			<Avatar
				class=""
				:title="false"
				:size="32"
				variant="beam"
				:name="props.address"
				:square="false"
			/>
		</template>
	</div>
</template>

<style scoped>
.posts-username {
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
</style>
