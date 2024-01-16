export type Option =
	| Readonly<{ key: 'slug'; value?: string }>
	| Readonly<{ key: 'rpc'; value?: string }>
	| Readonly<{ key: 'maxpage'; value?: number }>

export type TokenURIWithId = Readonly<{
	id: number
	image: string
}>

// export type OptionsDatabase = Readonly<{
// 	id: string
// 	slug?: string
// 	database:
// 		| {
// 		type: 'encoded:redis'
// 		key: string
// 	}
// 		| {
// 		type: 'documents:redis'
// 		key: string
// 	}
// }>
