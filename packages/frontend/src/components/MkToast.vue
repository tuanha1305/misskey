<template>
<div class="mk-toast">
	<Transition :name="$store.state.animation ? 'toast' : ''" appear @after-leave="emit('closed')">
		<div v-if="showing" class="body _acrylic" :style="{ zIndex }">
			<div class="message">
				{{ message }}
			</div>
		</div>
	</Transition>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as os from '@/os';

defineProps<{
	message: string;
}>();

const emit = defineEmits<{
	(ev: 'closed'): void;
}>();

const zIndex = os.claimZIndex('high');
let showing = $ref(true);

onMounted(() => {
	window.setTimeout(() => {
		showing = false;
	}, 4000);
});
</script>

<style lang="scss" scoped>
.toast-enter-active, .toast-leave-active {
	transition: opacity 0.3s, transform 0.3s !important;
}
.toast-enter-from, .toast-leave-to {
	opacity: 0;
	transform: translateY(-100%);
}

.mk-toast {
	> .body {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		margin: 0 auto;
		margin-top: 16px;
		min-width: 300px;
		max-width: calc(100% - 32px);
		width: min-content;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		border-radius: 8px;
		overflow: clip;
		text-align: center;
		pointer-events: none;

		> .message {
			padding: 16px 24px;
		}
	}
}
</style>
