// ─────────────────────────────────────────────
//  Sozo Design Tokens — fonte única de verdade
//  Importar como: import { C, GRAIN } from '@/lib/tokens'
// ─────────────────────────────────────────────

export const C = {
  // Backgrounds
  bg:      '#0D0906',   // preto quente
  bg2:     '#130B07',   // card background
  bg3:     '#1A0F06',   // card alternado
  surface: '#1F1209',   // surface elevado

  // Linhas / divisores
  line:    '#2A1A0D',
  lineHi:  '#3D2410',

  // Brand
  primary:  '#C4521A',  // laranja Sozo
  primaryL: '#E06A2C',  // laranja claro
  primaryD: '#8A3610',  // laranja escuro
  gold:     '#D4A84B',  // dourado complementar

  // Texto
  white:  '#FAF6F2',    // branco quente
  gray1:  '#E8DDD4',    // texto principal
  gray2:  '#B09880',    // texto secundário
  gray3:  '#6A4D35',    // texto mudo
} as const

// Textura grain — película quente sutil
export const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

// Gradiente do botão primário
export const BTN_GRADIENT = `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryL} 100%)`

// Sombra padrão do botão CTA
export const BTN_SHADOW = `0 0 28px rgba(196,82,26,0.30)`
export const BTN_SHADOW_HOVER = `0 0 48px rgba(196,82,26,0.50)`
