<!--
SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div ref="el" :class="$style.root">
	<header :class="[$style.header, { [$style.reduceAnimation]: !defaultStore.state.animation, [$style.showEl]: (showEl && ['hideHeaderOnly', 'hideHeaderFloatBtn', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) && isMobile && mainRouter.currentRoute.value.name === 'explore' }]" class="_button" :style="{ background: bg }" @click="showBody = !showBody">
		<div :class="$style.title"><div><slot name="header"></slot></div></div>
		<div :class="$style.divider"></div>
		<button class="_button" :class="$style.button">
			<template v-if="showBody"><i class="ti ti-chevron-up"></i></template>
			<template v-else><i class="ti ti-chevron-down"></i></template>
		</button>
	</header>
	<Transition
		:name="defaultStore.state.animation ? 'folder-toggle' : ''"
		@enter="enter"
		@afterEnter="afterEnter"
		@leave="leave"
		@afterLeave="afterLeave"
	>
		<div v-show="showBody">
			<slot></slot>
		</div>
	</Transition>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, shallowRef, watch } from 'vue';
import tinycolor from 'tinycolor2';
import { miLocalStorage } from '@/local-storage';
import { mainRouter } from '@/router';
import { defaultStore } from '@/store';
import { deviceKind } from '@/scripts/device-kind';
import { eventBus } from '@/scripts/cherrypick/eventBus';

const MOBILE_THRESHOLD = 500;

const isMobile = ref(deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD);
window.addEventListener('resize', () => {
	isMobile.value = deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD;
});

let showEl = $ref(false);

const miLocalStoragePrefix = 'ui:folder:' as const;

const props = withDefaults(defineProps<{
	expanded?: boolean;
	persistKey?: string;
}>(), {
	expanded: true,
});

const el = shallowRef<HTMLDivElement>();
const bg = ref<string | null>(null);
const showBody = ref((props.persistKey && miLocalStorage.getItem(`${miLocalStoragePrefix}${props.persistKey}`)) ? (miLocalStorage.getItem(`${miLocalStoragePrefix}${props.persistKey}`) === 't') : props.expanded);

watch(showBody, () => {
	if (props.persistKey) {
		miLocalStorage.setItem(`${miLocalStoragePrefix}${props.persistKey}`, showBody.value ? 't' : 'f');
	}
});

function enter(el: Element) {
	const elementHeight = el.getBoundingClientRect().height;
	el.style.height = 0;
	el.offsetHeight; // reflow
	el.style.height = elementHeight + 'px';
}

function afterEnter(el: Element) {
	el.style.height = null;
}

function leave(el: Element) {
	const elementHeight = el.getBoundingClientRect().height;
	el.style.height = elementHeight + 'px';
	el.offsetHeight; // reflow
	el.style.height = 0;
}

function afterLeave(el: Element) {
	el.style.height = null;
}

onMounted(() => {
	function getParentBg(el: HTMLElement | null): string {
		if (el == null || el.tagName === 'BODY') return 'var(--bg)';
		const bg = el.style.background || el.style.backgroundColor;
		if (bg) {
			return bg;
		} else {
			return getParentBg(el.parentElement);
		}
	}
	const rawBg = getParentBg(el.value);
	const _bg = tinycolor(rawBg.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(rawBg.slice(4, -1)) : rawBg);
	_bg.setAlpha(0.85);
	bg.value = _bg.toRgbString();

	eventBus.on('showEl', (showEl_receive) => {
		showEl = showEl_receive;
	});
});
</script>

<style lang="scss" module>
.folder-toggle-enter-active, .folder-toggle-leave-active {
	overflow-y: clip;
	transition: opacity 0.5s, height 0.5s !important;
}
.folder-toggle-enter-from {
	opacity: 0;
}
.folder-toggle-leave-to {
	opacity: 0;
}

.root {
	position: relative;
}

.header {
	display: flex;
	position: relative;
	z-index: 10;
	position: sticky;
	top: var(--stickyTop, 0px);
	-webkit-backdrop-filter: var(--blur, blur(8px));
	backdrop-filter: var(--blur, blur(20px));
	transition: opacity 0.5s, transform 0.5s;

	&.reduceAnimation {
		transition: opacity 0s, transform 0s;
	}

	&.showEl {
		transform: translateY(-50.55px);
	}
}

.title {
	display: grid;
	place-content: center;
	margin: 0;
	padding: 12px 16px 12px 0;
}

.divider {
	flex: 1;
	margin: auto;
	height: 1px;
	background: var(--divider);
}

.button {
	padding: 12px 0 12px 16px;
}

@container (max-width: 500px) {
	.title {
		padding: 8px 10px 8px 0;
	}
}
</style>
