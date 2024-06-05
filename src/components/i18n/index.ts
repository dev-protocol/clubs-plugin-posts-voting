import type { ClubsI18nParts } from '@devprotocol/clubs-core'

export const Strings = {
	RemovePoll: {
		en: 'Remove poll',
		ja: '投票フォームをキャンセル',
	},
	PollLength: {
		en: 'Poll length',
		ja: '投票期間',
	},
	Days: {
		en: 'Days',
		ja: '日',
	},
	Hours: {
		en: 'Hours',
		ja: '時間',
	},
	Minutes: {
		en: 'Minutes',
		ja: '分',
	},
	ImmediateResultPublicationSettings: {
		en: 'Immediate Result Publication Settings',
		ja: '投票期間中に結果を表示する',
	},
	Unpublished: {
		en: 'Poll Results are Unpublished',
		ja: '投票結果を表示できません。',
	},
	UnpublishedDetail: {
		en: 'At the moment, the poll results are set to unpublished.',
		ja: '投票期間中の結果表示が非表示に設定されています。',
	},
	PleaseWait: {
		en: 'Please wait until the voting period has ended.',
		ja: '投票期間の終了までお待ちください。',
	},
	LimitedAccess: {
		en: 'Limited access',
		ja: '限定アクセス',
	},
	Post: {
		en: 'Post',
		ja: '投稿',
	},
	Choice: {
		en: 'Choice',
		ja: '選択肢',
	},
	Votes: {
		en: 'Votes',
		ja: '投票数',
	},
	Remaining: {
		en: ([value, type]) => {
			if (type === 'none') return ''

			if (value && Number(value) > 0) {
				return `${value} ${type} left`
			}

			return ''
		},
		ja: ([value, type]) => {
			if (type === 'none') return ''

			if (value && Number(value) > 0) {
				return `終了まであと ${value} ${type === 'days' ? '日' : type === 'hours' ? '時間' : type === 'minutes' ? '分' : ''}`
			}

			return ''
		},
	},
} satisfies ClubsI18nParts
