<template>
<div class="_formRoot">
	<FormRange v-model="masterVolume" :min="0" :max="1" :step="0.05" :text-converter="(v) => `${Math.floor(v * 100)}%`" class="_formBlock">
		<template #label>{{ i18n.ts.masterVolume }}</template>
	</FormRange>

	<FormSection>
		<template #label>{{ i18n.ts.sounds }}</template>
		<FormFolder v-for="type in Object.keys(sounds)" :key="type" style="margin-bottom: 8px;">
			<template #label>{{ $t('_sfx.' + type) }}</template>
			<template #suffix>{{ sounds[type].type ?? i18n.ts.none }}</template>

			<XSound :type="sounds[type].type" :volume="sounds[type].volume" @update="(res) => updated(type, res)"/>
		</FormFolder>
	</FormSection>

	<FormButton danger class="_formBlock" @click="reset()"><i class="ti ti-reload"></i> {{ i18n.ts.default }}</FormButton>
</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import XSound from './sounds.sound.vue';
import FormRange from '@/components/form/range.vue';
import FormButton from '@/components/MkButton.vue';
import FormLink from '@/components/form/link.vue';
import FormSection from '@/components/form/section.vue';
import FormFolder from '@/components/form/folder.vue';
import * as os from '@/os';
import { ColdDeviceStorage } from '@/store';
import { playFile } from '@/scripts/sound';
import { i18n } from '@/i18n';
import { definePageMetadata } from '@/scripts/page-metadata';

const masterVolume = computed({
	get: () => {
		return ColdDeviceStorage.get('sound_masterVolume');
	},
	set: (value) => {
		ColdDeviceStorage.set('sound_masterVolume', value);
	},
});

const volumeIcon = computed(() => masterVolume.value === 0 ? 'fas fa-volume-mute' : 'fas fa-volume-up');

const sounds = ref({
	note: ColdDeviceStorage.get('sound_note'),
	noteMy: ColdDeviceStorage.get('sound_noteMy'),
	notification: ColdDeviceStorage.get('sound_notification'),
	chat: ColdDeviceStorage.get('sound_chat'),
	chatBg: ColdDeviceStorage.get('sound_chatBg'),
	antenna: ColdDeviceStorage.get('sound_antenna'),
	channel: ColdDeviceStorage.get('sound_channel'),
});

async function updated(type, sound) {
	const v = {
		type: sound.type,
		volume: sound.volume,
	};

	ColdDeviceStorage.set('sound_' + type, v);
	sounds.value[type] = v;
}

function reset() {
	for (const sound of Object.keys(sounds.value)) {
		const v = ColdDeviceStorage.default['sound_' + sound];
		ColdDeviceStorage.set('sound_' + sound, v);
		sounds.value[sound] = v;
	}
}

const headerActions = $computed(() => []);

const headerTabs = $computed(() => []);

definePageMetadata({
	title: i18n.ts.sounds,
	icon: 'ti ti-music',
});
</script>
