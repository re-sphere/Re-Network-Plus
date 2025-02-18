/*
 * SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type Keys =
	'v' |
	'lastVersion' |
	'instance' |
	'account' |
	'accounts' |
	'latestDonationInfoShownAt' |
	'neverShowDonationInfo' |
	'neverShowLocalOnlyInfo' |
	'lastUsed' |
	'lang' |
	'drafts' |
	'hashtags' |
	'wallpaper' |
	'theme' |
	'colorScheme' |
	'useSystemFont' |
	'fontSize' |
	'useBoldFont' |
	'ui' |
	'ui_temp' |
	'locale' |
	'localeVersion' |
	'customCss' |
	'message_drafts' |
	'scratchpad' |
	'debug' |
	`miux:${string}` |
	`ui:folder:${string}` |
	`themes:${string}` |
	`aiscript:${string}` |
	`aiscriptSecure:${string}` |
	'lastEmojisFetchedAt' | // DEPRECATED, stored in indexeddb (13.9.0~)
	'emojis' // DEPRECATED, stored in indexeddb (13.9.0~);

export const miLocalStorage = {
	getItem: (key: Keys): string | null => window.localStorage.getItem(key),
	setItem: (key: Keys, value: string): void => window.localStorage.setItem(key, value),
	removeItem: (key: Keys): void => window.localStorage.removeItem(key),
};
