/**
 * Design mode token variants.
 *
 * Each mode exports a `ModeTokenOverrides` object that partially overrides
 * the base Forge tokens (radii, shadows, card style, typography, accents).
 * Use `resolveModeTokens()` to merge overrides with base tokens.
 */

export type { ModeTokenOverrides } from './types';
export { resolveModeTokens } from './utils';
export type { ResolvedModeTokens } from './utils';

export { scrollyTokens } from './scrolly';
export { bentoTokens } from './bento';
export { editorialTokens } from './editorial';
export { notionTokens } from './notion';
export { m3Tokens } from './m3';

import type { DesignMode } from '@/types/common';
import type { ModeTokenOverrides } from './types';
import { scrollyTokens } from './scrolly';
import { bentoTokens } from './bento';
import { editorialTokens } from './editorial';
import { notionTokens } from './notion';
import { m3Tokens } from './m3';

export const modeTokenMap: Record<DesignMode, ModeTokenOverrides> = {
  scrolly: scrollyTokens,
  bento: bentoTokens,
  editorial: editorialTokens,
  notion: notionTokens,
  m3: m3Tokens,
};
