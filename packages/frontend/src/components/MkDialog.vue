<template>
<MkModal ref="modal" :prefer-type="'dialog'" :z-priority="'high'" @click="done(true)" @closed="emit('closed')">
	<div class="mk-dialog">
		<div v-if="icon" class="icon">
			<i :class="icon"></i>
		</div>
		<div v-else-if="!input && !select" class="icon" :class="type">
			<i v-if="type === 'success'" class="ti ti-check"></i>
			<i v-else-if="type === 'error'" class="ti ti-circle-x"></i>
			<i v-else-if="type === 'warning'" class="ti ti-alert-triangle"></i>
			<i v-else-if="type === 'info'" class="ti ti-info-circle"></i>
			<i v-else-if="type === 'question'" class="ti ti-question-circle"></i>
			<MkLoading v-else-if="type === 'waiting'" :em="true"/>
		</div>
		<header v-if="title"><Mfm :text="title"/></header>
		<div v-if="text" class="body"><Mfm :text="text"/></div>
		<MkInput v-if="input" v-model="inputValue" autofocus :type="input.type || 'text'" :placeholder="input.placeholder || undefined" @keydown="onInputKeydown">
			<template v-if="input.type === 'password'" #prefix><i class="ti ti-lock"></i></template>
		</MkInput>
		<MkSelect v-if="select" v-model="selectedValue" autofocus>
			<template v-if="select.items">
				<option v-for="item in select.items" :value="item.value">{{ item.text }}</option>
			</template>
			<template v-else>
				<optgroup v-for="groupedItem in select.groupedItems" :label="groupedItem.label">
					<option v-for="item in groupedItem.items" :value="item.value">{{ item.text }}</option>
				</optgroup>
			</template>
		</MkSelect>
		<div v-if="(showOkButton || showCancelButton) && !actions" class="buttons">
			<MkButton v-if="showOkButton" inline primary :autofocus="!input && !select" @click="ok">{{ (showCancelButton || input || select) ? i18n.ts.ok : i18n.ts.gotIt }}</MkButton>
			<MkButton v-if="showCancelButton || input || select" inline @click="cancel">{{ i18n.ts.cancel }}</MkButton>
		</div>
		<div v-if="actions" class="buttons">
			<MkButton v-for="action in actions" :key="action.text" inline :primary="action.primary" @click="() => { action.callback(); close(); }">{{ action.text }}</MkButton>
		</div>
	</div>
</MkModal>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import MkModal from '@/components/MkModal.vue';
import MkButton from '@/components/MkButton.vue';
import MkInput from '@/components/form/input.vue';
import MkSelect from '@/components/form/select.vue';
import { i18n } from '@/i18n';

type Input = {
	type: HTMLInputElement['type'];
	placeholder?: string | null;
	default: any | null;
};

type Select = {
	items: {
		value: string;
		text: string;
	}[];
	groupedItems: {
		label: string;
		items: {
			value: string;
			text: string;
		}[];
	}[];
	default: string | null;
};

const props = withDefaults(defineProps<{
	type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'waiting';
	title: string;
	text?: string;
	input?: Input;
	select?: Select;
	icon?: string;
	actions?: {
		text: string;
		primary?: boolean,
		callback: (...args: any[]) => void;
	}[];
	showOkButton?: boolean;
	showCancelButton?: boolean;
	cancelableByBgClick?: boolean;
}>(), {
	type: 'info',
	showOkButton: true,
	showCancelButton: false,
	cancelableByBgClick: true,
});

const emit = defineEmits<{
	(ev: 'done', v: { canceled: boolean; result: any }): void;
	(ev: 'closed'): void;
}>();

const modal = ref<InstanceType<typeof MkModal>>();

const inputValue = ref(props.input?.default || null);
const selectedValue = ref(props.select?.default || null);

function done(canceled: boolean, result?) {
	emit('done', { canceled, result });
	modal.value?.close();
}

async function ok() {
	if (!props.showOkButton) return;

	const result =
		props.input ? inputValue.value :
		props.select ? selectedValue.value :
		true;
	done(false, result);
}

function cancel() {
	done(true);
}
/*
function onBgClick() {
	if (props.cancelableByBgClick) cancel();
}
*/
function onKeydown(evt: KeyboardEvent) {
	if (evt.key === 'Escape') cancel();
}

function onInputKeydown(evt: KeyboardEvent) {
	if (evt.key === 'Enter') {
		evt.preventDefault();
		evt.stopPropagation();
		ok();
	}
}

onMounted(() => {
	document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
	document.removeEventListener('keydown', onKeydown);
});
</script>

<style lang="scss" scoped>
.mk-dialog {
	position: relative;
	padding: 32px;
	min-width: 320px;
	max-width: 480px;
	box-sizing: border-box;
	text-align: center;
	background: var(--panel);
	border-radius: var(--radius);

	> .icon {
		font-size: 24px;

		&.info {
			color: #55c4dd;
		}

		&.success {
			color: var(--success);
		}

		&.error {
			color: var(--error);
		}

		&.warning {
			color: var(--warn);
		}

		> * {
			display: block;
			margin: 0 auto;
		}

		& + header {
			margin-top: 8px;
		}
	}

	> header {
		margin: 0 0 8px 0;
		font-weight: bold;
		font-size: 1.1em;

		& + .body {
			margin-top: 8px;
		}
	}

	> .body {
		margin: 16px 0 0 0;
	}

	> .buttons {
		margin-top: 16px;

		> * {
			margin: 0 8px;
		}
	}
}
</style>
