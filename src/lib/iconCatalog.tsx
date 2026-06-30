// ─────────────────────────────────────────────
//  Catálogo de Ícones — Ministérios & Eventos
//  Fonte única para os seletores de ícone usados
//  em MinisteriosPage e EventosPage.
//
//  Cada item tem uma `key` estável (salva no banco
//  como `iconKey`) e um componente `Icon` (lucide-react).
// ─────────────────────────────────────────────
import type { LucideIcon } from 'lucide-react'

import {
  Church, Music, HandHelping, BookOpen, Crown, Flame, Heart, Bird,
  Droplet, Sprout, Star, Drum, Guitar, Mic, Megaphone, Handshake,
  Baby, Users, PartyPopper, Moon, Tent, Globe, Cross, Sparkle,
} from 'lucide-react'

export interface IconCatalogItem {
  key:  string
  Icon: LucideIcon
}

// Usado por Ministérios e Eventos (conjunto comum + extras de cada um)
export const MINISTRY_ICONS: IconCatalogItem[] = [
  { key: 'church',     Icon: Church },
  { key: 'music',      Icon: Music },
  { key: 'praying',    Icon: HandHelping },
  { key: 'book',       Icon: BookOpen },
  { key: 'crown',      Icon: Crown },
  { key: 'flame',      Icon: Flame },
  { key: 'heart',      Icon: Heart },
  { key: 'dove',       Icon: Bird },
  { key: 'water',      Icon: Droplet },
  { key: 'sprout',     Icon: Sprout },
  { key: 'star',       Icon: Star },
  { key: 'drum',       Icon: Drum },
  { key: 'guitar',     Icon: Guitar },
  { key: 'mic',        Icon: Mic },
  { key: 'megaphone',  Icon: Megaphone },
  { key: 'handshake',  Icon: Handshake },
  { key: 'baby',       Icon: Baby },
  { key: 'kids',       Icon: Users },
  { key: 'family',     Icon: Heart },
  { key: 'wedding',    Icon: PartyPopper },
  { key: 'tent',       Icon: Tent },
  { key: 'globe',      Icon: Globe },
]

export const EVENT_ICONS: IconCatalogItem[] = [
  { key: 'cross',      Icon: Cross },
  { key: 'flame',      Icon: Flame },
  { key: 'dove',       Icon: Bird },
  { key: 'heart',      Icon: Heart },
  { key: 'music',      Icon: Music },
  { key: 'crown',      Icon: Crown },
  { key: 'water',      Icon: Droplet },
  { key: 'party',      Icon: PartyPopper },
  { key: 'praying',    Icon: HandHelping },
  { key: 'church',     Icon: Church },
  { key: 'book',       Icon: BookOpen },
  { key: 'moon',       Icon: Moon },
  { key: 'star',       Icon: Star },
  { key: 'tent',       Icon: Tent },
]

const ALL_ICONS = [...MINISTRY_ICONS, ...EVENT_ICONS]

/** Resolve uma key salva no banco para o componente de ícone correspondente. */
export function getIconByKey(key: string | undefined | null): LucideIcon {
  return ALL_ICONS.find(i => i.key === key)?.Icon ?? Sparkle
}

// ─────────────────────────────────────────────
//  Compatibilidade com dados antigos (emoji)
//  Registros salvos antes da migração para iconKey
//  ainda têm `emoji` no Firestore. Este mapa traduz
//  o emoji antigo para a key nova mais próxima, só
//  para fins de exibição — ao salvar, sempre grava iconKey.
// ─────────────────────────────────────────────
const LEGACY_EMOJI_MAP: Record<string, string> = {
  '⛪': 'church',
  '🎵': 'music',
  '🙏': 'praying',
  '📖': 'book',
  '👑': 'crown',
  '🔥': 'flame',
  '❤️': 'heart',
  '🕊': 'dove',
  '💧': 'water',
  '🌱': 'sprout',
  '⭐': 'star',
  '🥁': 'drum',
  '🎹': 'music',
  '🎸': 'guitar',
  '🎤': 'mic',
  '📢': 'megaphone',
  '👨‍👩‍👧': 'family',
  '💒': 'wedding',
  '🏕': 'tent',
  '🌍': 'globe',
  '✝': 'cross',
  '🎉': 'party',
  '🌙': 'moon',
}

/** Resolve um item (ministério/evento) vindo do Firestore para a key de ícone correta,
 *  seja porque já tem `iconKey`, seja traduzindo o `emoji` legado. */
export function resolveIconKey(item: { iconKey?: string | null; emoji?: string | null }): string {
  if (item.iconKey) return item.iconKey
  if (item.emoji && LEGACY_EMOJI_MAP[item.emoji]) return LEGACY_EMOJI_MAP[item.emoji]
  return 'church'
}
