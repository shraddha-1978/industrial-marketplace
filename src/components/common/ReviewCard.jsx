import Icon from './Icon'
import Stars from './Stars'
import './ReviewCard.css'

// Deterministic avatar colour derived from reviewer name so it's consistent.
const AVATAR_COLORS = [
  '#1a5dc9', '#d97706', '#0d9488', '#7c3aed',
  '#dc2626', '#0891b2', '#16a34a', '#c2410c',
]
const nameColor = (name = '') => {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export default function ReviewCard({ review }) {
  const color = review.color || nameColor(review.name)
  const initials = (review.name || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="review-card">
      <div className="rc-head">
        <span className="rc-avatar" style={{ background: color }}>
          {initials}
        </span>
        <div className="rc-meta">
          <p className="rc-name">
            {review.name}
            <Icon name="BadgeCheck" size={14} className="rc-verified" />
          </p>
          <p className="rc-role">
            {review.role}
            {review.company ? ` · ${review.company}` : ''}
          </p>
        </div>
        <span className="rc-date">{review.date}</span>
      </div>
      <div className="rc-stars">
        <Stars value={review.rating} showValue={false} size={14} />
      </div>
      <p className="rc-text">{review.text}</p>
    </div>
  )
}
