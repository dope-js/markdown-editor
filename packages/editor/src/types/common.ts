import type { enUS } from '@/contexts/editor/locale';

export type TranslateFn = (key: keyof typeof enUS, params?: Record<string, string>) => string;
