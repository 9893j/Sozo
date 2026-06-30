export const C = {
  bg:       '#0D0906',
  bg2:      '#130B07',
  bg3:      '#1A0F06',
  surface:  '#1F1209',
  line:     '#2A1A0D',
  lineHi:   '#3D2410',
  primary:  '#C4521A',
  primaryL: '#E06A2C',
  primaryD: '#8A3610',
  gold:     '#D4A84B',
  white:    '#FAF6F2',
  gray1:    '#E8DDD4',
  gray2:    '#B09880',
  gray3:    '#6A4D35',
} as const

export const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`

export const BTN_GRADIENT = `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryL} 100%)`
export const BTN_SHADOW = `0 0 28px rgba(196,82,26,0.30)`
export const BTN_SHADOW_HOVER = `0 0 48px rgba(196,82,26,0.50)`
