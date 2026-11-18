// Renders a star rating. `value` is 0-5, `count` shows the review count.

export default function Stars({ value = 0, count, size = 15, showValue = true }) {
  const rounded = Math.round(value)
  return (
    <span className="stars" style={{ '--star-size': `${size}px` }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={i <= rounded ? '' : 'empty'}
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 18l-6.1 3.1 1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
      {showValue && value > 0 && <span className="rating-text">{value.toFixed(1)}</span>}
      {count != null && (
        <span
          style={{
            marginLeft: 4,
            fontSize: 12.5,
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          ({count})
        </span>
      )}
    </span>
  )
}
