<template>
<div class="_formRoot">
	<FormSelect v-model="type">
		<template #label>{{ i18n.ts.sound }}</template>
		<option v-for="x in soundsTypes" :key="x" :value="x">{{ x == null ? i18n.ts.none : x }}</option>
	</FormSelect>
	<FormRange v-model="volume" :min="0" :max="1" :step="0.05" :text-converter="(v) => `${Math.floor(v * 100)}%`" class="_formBlock">
		<template #label>{{ i18n.ts.volume }}</template>
	</FormRange>

	<div style="display: flex; gap: var(--margin); flex-wrap: wrap;">
		<FormButton inline @click="listen"><i class="ti ti-player-play"></i> {{ i18n.ts.listen }}</FormButton>
		<FormButton inline primary @click="save"><i class="ti ti-check"></i> {{ i18n.ts.save }}</FormButton>
	</div>
</div>
</template>

<script lang="ts" setup>
import { } from 'vue';
import FormSelect from '@/components/form/select.vue';
import FormButton from '@/components/MkButton.vue';
import FormRange from '@/components/form/range.vue';
import { i18n } from '@/i18n';
import { playFile, soundsTypes } from '@/scripts/sound';

const props = defineProps<{
	type: string;
	volume: number;
}>();

const emit = defineEmits<{
	(ev: 'update', result: { type: string; volume: number; }): void;
}>();

let type = $ref(props.type);
let volume = $ref(props.volume);

function listen() {
	playFile(type, volume);
}

function save() {
	emit('update', { type, volume });
}
</script>
