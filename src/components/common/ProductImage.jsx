import Icon from './Icon'
import { getCategoryById } from '../../data/categories'
import './ProductImage.css'

/**
 * Self-contained product illustration.
 *
 * Renders a deterministic, category-themed vector illustration so the app
 * works fully offline without any external image dependencies.
 * A hash of the product id varies the visual composition between cards.
 */

const hash = (str) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function tint(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const r = clamp((n >> 16) + Math.round(255 * amt), 0, 255)
  const g = clamp(((n >> 8) & 0xff) + Math.round(255 * amt), 0, 255)
  const b = clamp((n & 0xff) + Math.round(255 * amt), 0, 255)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export default function ProductImage({ product, categoryId, brand, size = 'lg', seedKey }) {
  const cat = getCategoryById(product?.categoryId || categoryId) || {
    accent: '#1a5dc9',
    accentLight: '#eff5ff',
    icon: 'Package',
  }

  const seed = hash(seedKey || product?.id || brand || cat.id || 'x')
  const accent = cat.accent
  const accentLight = cat.accentLight
  const accentSoft = tint(accent, 0.32)
  const accentDeep = tint(accent, -0.18)

  const angle = 110 + (seed % 80)
  const pattern = seed % 3        // 0 = dots, 1 = diagonal lines, 2 = concentric arcs
  const plateX = 50 + ((seed % 5) - 2) * 3   // slight horizontal offset per product
  const dotCount = 6 + (seed % 6)

  const brandName = product?.brand || brand || 'IndusMart'

  /* ---- background gradient ---- */
  const bg = `linear-gradient(${angle}deg, ${accentLight} 0%, #ffffff 55%, ${tint(accent, 0.44)} 100%)`

  return (
    <div
      className={`product-image product-image-${size}`}
      style={{ background: bg, '--pi-accent': accent }}
    >
      {/* Soft radial glow */}
      <div
        className="pi-glow"
        style={{
          background: `radial-gradient(circle at 76% 20%, ${accent}30 0%, transparent 58%)`,
        }}
      />

      {/* SVG decorative pattern layer */}
      <svg
        className="pi-pattern"
        viewBox="0 0 200 150"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {pattern === 0 &&
          Array.from({ length: dotCount }).map((_, i) => (
            <circle
              key={i}
              cx={((seed * (i + 3)) % 190) + 5}
              cy={((seed * (i + 7)) % 135) + 5}
              r={1.5 + ((seed >> i) % 3)}
              fill={accent}
              opacity="0.22"
            />
          ))}

        {pattern === 1 &&
          Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={i * 24 - 10}
              y1="0"
              x2={i * 24 + 36}
              y2="150"
              stroke={accent}
              strokeOpacity="0.07"
              strokeWidth="1.5"
            />
          ))}

        {pattern === 2 &&
          [0, 1, 2, 3].map((i) => (
            <circle
              key={i}
              cx="170"
              cy="15"
              r={22 + i * 20}
              fill="none"
              stroke={accent}
              strokeOpacity="0.1"
              strokeWidth="1.5"
            />
          ))}
      </svg>

      {/* Central product icon plate */}
      <div
        className="pi-plate"
        style={{ left: `${plateX}%` }}
      >
        <div
          className="pi-plate-inner"
          style={{ background: accent }}
        >
          <Icon
            name={cat.icon}
            size={size === 'sm' ? 28 : 46}
            color="#fff"
            strokeWidth={1.5}
          />
        </div>
        <span
          className="pi-plate-shadow"
          style={{ background: accentDeep }}
        />
      </div>

      {/* Brand chip */}
      <span
        className="pi-brand"
        style={{ color: accentDeep, borderColor: accentSoft }}
      >
        {brandName}
      </span>
    </div>
  )
}
