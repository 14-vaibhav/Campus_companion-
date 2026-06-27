export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.ceil(total / limit) || 1;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', padding: '16px 0' }}>
      <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
      </button>
      {pages.map((p) => (
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>
          {p}
        </button>
      ))}
      <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
      </button>
      <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginLeft: 8 }}>
        {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
      </span>
    </div>
  );
}
