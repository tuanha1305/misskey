<template>
<MkTooltip ref="tooltip" :showing="showing" :target-element="targetElement" :max-width="340" @closed="emit('closed')">
	<div class="beeadbfb">
		<XReactionIcon :reaction="reaction" class="icon" :no-style="true"/>
		<div class="name">{{ reaction.replace('@.', '') }}</div>
	</div>
</MkTooltip>
</template>

<script lang="ts" setup>
import { } from 'vue';
import MkTooltip from './MkTooltip.vue';
import XReactionIcon from '@/components/MkReactionIcon.vue';

defineProps<{
	showing: boolean;
	reaction: string;
	targetElement: HTMLElement;
}>();

const emit = defineEmits<{
	(ev: 'closed'): void;
}>();
</script>

<style lang="scss" scoped>
.beeadbfb {
	text-align: center;

	> .icon {
		display: block;
		width: 60px;
		font-size: 60px; // unicodeな絵文字についてはwidthが効かないため
		margin: 0 auto;
		object-fit: contain;
	}

	> .name {
		font-size: 0.9em;
	}
}
</style>
