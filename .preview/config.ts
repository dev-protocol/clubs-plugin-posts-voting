import { encode } from '@devprotocol/clubs-core'
import { v5 as uuidv5 } from 'uuid'
import { toUtf8Bytes } from 'ethers'

const payloads: readonly Uint8Array[] = [
	toUtf8Bytes('tier-1'), // 0x6bb2c535a20b09c1272e9c28409c173522b1a659da8ecb7b8df3204dc00aa1e0
	toUtf8Bytes('tier-2'), // 0xe86e65ea87148d040ea25da9aef660e75cb542a1cf58120893fd0c6fb8c7963f
	toUtf8Bytes('tier-3'), // 0x63646512c4ebf758a369cf90a4d09aa2faa86dd1db635a2b62e91a5ed4c2b5b9
]

/**
 * ## How to debug `required-one-of` option
 * Property Tokens "0xE59fEDaBB0F79b0EC605737805a9125cd8d87B1f" is Property Tokens without custom
 * descriptors (=it means you can use any payloads to mint sTokens) minted on Polygon Mumbai.
 * You can debug "require-one-of" by calling `Lockup.depositToProperty(address,uint256,bytes32)`
 * with the first argument set as "0xE59fEDaBB0F79b0EC605737805a9125cd8d87B1f", amount set as 0,
 * and payload set as the membership value you want to debug.
 *
 * 1. Open https://mumbai.polygonscan.com/address/0xfdc5ff1f07871a247eafe14eeb134eefcbcf1cea#writeProxyContract
 * 2. Toggle [3. depositToProperty (0xe78468f0)]
 * 3. Input the following values:
 *    _property: 0xE59fEDaBB0F79b0EC605737805a9125cd8d87B1f
 *    _amount: 0
 *    _payload: the hex value of the membership payload you want to debug like 0x6bb2c535a20b09c1272e9c28409c173522b1a659da8ecb7b8df3204dc00aa1e0
 *
 * ## How to know hex value from a Uint8Array
 * 1. Access https://playground.ethers.org/
 * 2. Run `utils.keccak256(new Uint8Array([…]))`
 *    Or `utils.keccak256(utils.toUtf8Bytes('…'))` if you want to use a string as a key
 */

export default () =>
	encode({
		name: 'Debug',
		twitterHandle: '@debug',
		description: '',
		url: '',
		propertyAddress: '0xF5fb43b4674Cc8D07FB45e53Dc77B651e17dC407',
		chainId: 137,
		rpcUrl: 'https://polygon-rpc.com',
		adminRolePoints: 0,
		plugins: [
			{
				id: 'example-theme',
				options: [],
			},
			{
				id: 'devprotocol:clubs:plugin:posts',
				options: [
					{
						key: 'feeds',
						value: [
							{
								id: 'default-2-id',
								title: 'default-2-title',
								slugs: 'default-2-slug',
								database: {
									type: 'documents:redis',
									key: uuidv5(
										toUtf8Bytes('default-2'),
										uuidv5('EXAMPLE_NAMESPACE', uuidv5.URL),
									), // > posts::694666bb-b2ec-542b-a5d6-65b470e5c494
								},
							},
							{
								id: 'default-3',
								title: '',
								slugs: 'default-3-slug',
								database: {
									type: 'documents:redis',
									key: uuidv5(
										toUtf8Bytes('default-2'),
										uuidv5('EXAMPLE_NAMESPACE', uuidv5.URL),
									), // > posts::694666bb-b2ec-542b-a5d6-65b470e5c494
								},
							},
						],
					},
				],
			},
			{
				id: 'devprotocol:clubs:plugin:posts:voting',
				options: [],
			},
			{
				id: 'devprotocol:clubs:simple-memberships',
				options: [
					{
						key: 'memberships',
						value: [
							{
								id: 'tier-3',
								name: 'Tier 3',
								description: 'lorem ipsum',
								price: 3,
								currency: 'ETH',
								imageSrc: 'https://i.imgur.com/wwJ2rBf.png',
								payload: payloads[2],
							},
							{
								id: 'tier-2',
								name: 'Tier 2',
								description: 'lorem ipsum',
								price: 2,
								currency: 'ETH',
								imageSrc: 'https://i.imgur.com/YaNNZ2F.png',
								payload: payloads[1],
							},
							{
								id: 'tier-1',
								name: 'Tier 1',
								description: 'lorem ipsum',
								price: 1,
								currency: 'ETH',
								imageSrc: 'https://i.imgur.com/sznqcmL.png',
								payload: payloads[0],
							},
						],
					},
				],
			},
		],
	})
