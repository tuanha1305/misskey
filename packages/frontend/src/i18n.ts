import { markRaw } from 'vue';
import { locale } from '@/config';
import { I18n } from '@/scripts/i18n';

export const i18n = markRaw(new I18n(locale));
