import type { Reactions } from '@devprotocol/clubs-plugin-posts'

export const isOwner = (
	createdBy: string | undefined,
	address: string | undefined,
): boolean => {
	if (!createdBy || !address) {
		return false
	}

	return createdBy === address
}

export const isVoted = (
	reactions: Reactions[],
	address: string | undefined,
) => {
	if (!address) {
		return false
	}

	return reactions.some((reaction) => {
		return Object(reaction).value.includes(address)
	})
}

export const totalVotes = (reactions: Reactions[]) => {
	return reactions.reduce((acc, reaction) => {
		return acc + Object(reaction).value.length
	}, 0)
}

export const getExpirationTime = (
	createdAt: string,
	day: number,
	hours: number,
	minutes: number,
) => {
	const createdDate = new Date(createdAt)
	const expirationDate = new Date(
		createdDate.getFullYear(),
		createdDate.getMonth(),
		Number(createdDate.getDate()) + Number(day),
		Number(createdDate.getHours()) + Number(hours),
		Number(createdDate.getMinutes()) + Number(minutes),
	)

	return expirationDate
}

export const remainingTime = (
	createdAt: string,
	day: number,
	hours: number,
	minutes: number,
) => {
	const expirationTime = getExpirationTime(createdAt, day, hours, minutes)
	const now = new Date()
	const remaining = expirationTime.getTime() - now.getTime()

	const dayRemaining = Math.floor(remaining / (1000 * 60 * 60 * 24))
	const hourRemaining = Math.floor(
		(remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
	)
	const minuteRemaining = Math.floor(
		(remaining % (1000 * 60 * 60)) / (1000 * 60),
	)

	if (dayRemaining > 0) {
		return [dayRemaining.toString(), 'days']
	} else if (hourRemaining > 0) {
		return [hourRemaining.toString(), 'hours']
	} else if (minuteRemaining > 0) {
		return [minuteRemaining.toString(), 'minutes']
	}

	return ['', 'none']
}

export const isExpired = (
	createdAt: string,
	day: number,
	hours: number,
	minutes: number,
) => {
	const expirationTime = getExpirationTime(createdAt, day, hours, minutes)
	const now = new Date()
	return now > expirationTime
}
