<!--
SPDX-FileCopyrightText: syuilo and noridev and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<component :is="link ? MkA : 'span'" v-user-preview="preview ? user.id : undefined" v-bind="bound" class="_noSelect" :class="$style.root" :style="{ color }" :title="acct(user)" @click="onClick">
	<MkImgWithBlurhash :class="[$style.inner, { [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect, [$style.noDrag]: noDrag }]" :src="url" :hash="user?.avatarBlurhash" :cover="true" :onlyAvgColor="true" :noDrag="true"/>
</component>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import * as misskey from 'cherrypick-js';
import MkImgWithBlurhash from '../MkImgWithBlurhash.vue';
import MkA from './MkA.vue';
import { getStaticImageUrl } from '@/scripts/media-proxy';
import { extractAvgColorFromBlurhash } from '@/scripts/extract-avg-color-from-blurhash';
import { acct, userPage } from '@/filters/user';
import { defaultStore } from '@/store';

const props = withDefaults(defineProps<{
	user: misskey.entities.User;
	target?: string | null;
	link?: boolean;
	preview?: boolean;
}>(), {
	target: null,
	link: false,
	preview: false,
});

const emit = defineEmits<{
	(ev: 'click', v: MouseEvent): void;
}>();

const bound = $computed(() => props.link
	? { to: userPage(props.user), target: props.target }
	: {});

const url = $computed(() => defaultStore.state.disableShowingAnimatedImages
	? getStaticImageUrl(props.user.avatarUrl)
	: props.user.avatarUrl);

function onClick(ev: MouseEvent): void {
	if (props.link) return;
	emit('click', ev);
}

let color = $ref<string | undefined>();

watch(() => props.user.avatarBlurhash, () => {
	color = extractAvgColorFromBlurhash(props.user.avatarBlurhash);
}, {
	immediate: true,
});
</script>

<style lang="scss" module>
.root {
	position: relative;
	display: inline-block;
	vertical-align: bottom;
	flex-shrink: 0;
	// border-radius: 100%;
	line-height: 16px;
}

.inner {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	border-radius: 28px;
	z-index: 1;
	overflow: clip;
	object-fit: cover;
	width: 100%;
	height: 100%;
	opacity: .7;

	&.reduceBlurEffect {
		opacity: 1;
	}

	&.noDrag {
		-webkit-user-drag: none;
	}
}
</style>
