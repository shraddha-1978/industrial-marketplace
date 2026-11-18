import Icon from './Icon'

export default function Logo({ size = 'md', light = false }) {
  const textSize = size === 'lg' ? 26 : 21
  const boxSize = size === 'lg' ? 42 : 36
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`} style={{ '--logo-box': `${boxSize}px` }}>
      <span className="logo-mark">
        <Icon name="Factory" size={boxSize * 0.55} strokeWidth={2.2} />
      </span>
      <span className="logo-text" style={{ fontSize: textSize }}>
        Indus<span className="logo-text-accent">Mart</span>
      </span>
      <style>{`
        .logo { display: inline-flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: -0.4px; }
        .logo-mark {
          width: var(--logo-box);
          height: var(--logo-box);
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: linear-gradient(135deg, #1a5dc9 0%, #2563eb 55%, #3b82f6 100%);
          box-shadow: 0 6px 16px -6px rgba(26,93,201,0.7);
        }
        .logo-text { color: var(--text-heading); }
        .logo-text-accent { color: var(--blue-600); }
        .logo-light .logo-text { color: #fff; }
        .logo-light .logo-text-accent { color: #93c5fd; }
      `}</style>
    </span>
  )
}
