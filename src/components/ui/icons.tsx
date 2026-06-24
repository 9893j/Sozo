// Ícones SVG minimalistas — traço único, 1.5px stroke, estilo enterprise
// Uso: <Icon name="users" size={16} color="currentColor" />
import {
  X, Check, ArrowRight, ArrowLeft, CalendarDays, ThumbsUp, Heart, HandHelping,
} from 'lucide-react'

interface IconProps { size?: number; color?: string; style?: React.CSSProperties }

const S = (d: string, extra?: string) => ({ size = 16, color = 'currentColor', style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} {...(extra ? { dangerouslySetInnerHTML:{ __html: d } } : {})}>
    <path d={d} />
  </svg>
)

// Componente base mais flexível
function Icon({ d, d2, size = 16, color = 'currentColor', style }: { d: string; d2?: string; size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
      {d2 && <path d={d2} />}
    </svg>
  )
}

export const Icons = {
  // Nav
  dashboard:    (p: IconProps) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" />,
  users:        (p: IconProps) => <Icon {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" d2="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />,
  ministry:     (p: IconProps) => <Icon {...p} d="M18 20V10M12 20V4M6 20v-6" />,
  schedule:     (p: IconProps) => <Icon {...p} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  calendar:     (p: IconProps) => <Icon {...p} d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" d2="M16 2v4M8 2v4M3 10h18" />,
  prayer:       (p: IconProps) => <Icon {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  posts:        (p: IconProps) => <Icon {...p} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  live:         (p: IconProps) => <Icon {...p} d="M23 7l-7 5 7 5V7z" d2="M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1V5z" />,
  lock:         (p: IconProps) => <Icon {...p} d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" d2="M7 11V7a5 5 0 0 1 10 0v4" />,
  user:         (p: IconProps) => <Icon {...p} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" d2="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,

  // Ações
  plus:         (p: IconProps) => <Icon {...p} d="M12 5v14M5 12h14" />,
  edit:         (p: IconProps) => <Icon {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" d2="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
  trash:        (p: IconProps) => <Icon {...p} d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />,
  search:       (p: IconProps) => <Icon {...p} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />,
  filter:       (p: IconProps) => <Icon {...p} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  chevronDown:  (p: IconProps) => <Icon {...p} d="M6 9l6 6 6-6" />,
  chevronRight: (p: IconProps) => <Icon {...p} d="M9 18l6-6-6-6" />,
  arrowLeft:    (p: IconProps) => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7" />,
  logout:       (p: IconProps) => <Icon {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  check:        (p: IconProps) => <Icon {...p} d="M20 6L9 17l-5-5" />,
  x:            (p: IconProps) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />,
  upload:       (p: IconProps) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
  eye:          (p: IconProps) => <Icon {...p} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" d2="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  heart:        (p: IconProps) => <Icon {...p} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  share:        (p: IconProps) => <Icon {...p} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />,
  repeat:       (p: IconProps) => <Icon {...p} d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />,
  mail:         (p: IconProps) => <Icon {...p} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" d2="M22 6l-10 7L2 6" />,
  phone:        (p: IconProps) => <Icon {...p} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  mapPin:       (p: IconProps) => <Icon {...p} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" d2="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
  star:         (p: IconProps) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  bell:         (p: IconProps) => <Icon {...p} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,
  settings:     (p: IconProps) => <Icon {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" d2="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />,
  invite:       (p: IconProps) => <Icon {...p} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" d2="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19 8v6M22 11h-6" />,
  activity:     (p: IconProps) => <Icon {...p} d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  layers:       (p: IconProps) => <Icon {...p} d="M12 2L2 7l10 5 10-5-10-5z" d2="M2 17l10 5 10-5M2 12l10 5 10-5" />,

  // UI — close / confirmação / navegação (lucide-react)
  close:        ({ size = 16, color = 'currentColor', style }: IconProps) => <X size={size} color={color} style={style} strokeWidth={1.75} />,
  checkCircle:  ({ size = 16, color = 'currentColor', style }: IconProps) => <Check size={size} color={color} style={style} strokeWidth={2} />,
  arrowRight:   ({ size = 16, color = 'currentColor', style }: IconProps) => <ArrowRight size={size} color={color} style={style} strokeWidth={1.75} />,
  arrowLeftSm:  ({ size = 16, color = 'currentColor', style }: IconProps) => <ArrowLeft size={size} color={color} style={style} strokeWidth={1.75} />,
  calendarDays: ({ size = 16, color = 'currentColor', style }: IconProps) => <CalendarDays size={size} color={color} style={style} strokeWidth={1.5} />,
  thumbsUp:     ({ size = 16, color = 'currentColor', style }: IconProps) => <ThumbsUp size={size} color={color} style={style} strokeWidth={1.75} />,
  heartFilled:  ({ size = 16, color = 'currentColor', style }: IconProps) => <Heart size={size} color={color} fill={color} style={style} strokeWidth={1.75} />,
  heartLine:    ({ size = 16, color = 'currentColor', style }: IconProps) => <Heart size={size} color={color} style={style} strokeWidth={1.75} />,
  prayingHands: ({ size = 16, color = 'currentColor', style }: IconProps) => <HandHelping size={size} color={color} style={style} strokeWidth={1.5} />,
}
