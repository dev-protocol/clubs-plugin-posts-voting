export type VotingRequestJson = Readonly<{
	hash: string
	sig: string
	feedId: string
	vote: string
}>

export const votingHandler = async ({
	request,
}: Readonly<{ request: Request }>) => {
	const { feedId, vote } = (await request.json()) as VotingRequestJson
	// const { hash, sig, feedId, vote } =
	// 	(await request.json()) as VotingRequestJson
	//
	// console.log('hash', hash)
	// console.log('sig', sig)

	if (!feedId) {
		return new Response(
			JSON.stringify({
				error: 'Missing data',
			}),
			{
				status: 400,
			},
		)
	}

	// Todo: 最新の投票データを取得する。Fetch individual postでOK?
	// const response = await fetch(
	// 	`/api/devprotocol:clubs:plugin:posts/${feedId}/message`,
	// )
	// const latestPosts = await response.json()
	// console.log('latestPosts', latestPosts)

	// get user address
	// const userAddress = verifyMessage(hash, sig)

	// Todo: 投票データを更新するpatchのAPIをCallする
	// const requestInfo = {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({
	// 		feedId,
	// 		vote,
	// 		hash,
	// 		sig,
	// 		latestPosts,
	// 	}),
	// }
	//
	// const res = await fetch(
	// 	'/api/devprotocol:clubs:plugin:posts/vote',
	// 	requestInfo,
	// )
	// if (!res.ok) {
	// 	return new Response(
	// 		JSON.stringify({
	// 			error: 'Failed to vote',
	// 		}),
	// 		{
	// 			status: 400,
	// 		},
	// 	)
	// }

	// 200 OK
	return new Response(
		JSON.stringify({
			message: `voted ${vote} ok!!`,
		}),
		{
			status: 200,
		},
	)
}
