export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-copy-block">
          <div className="footer-copy-main">© 2026 TripWell</div>
          <div className="footer-copy-sub">Bandung Barat · Aksesibilitas Tanpa Batas.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Presented by
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
            <span className="footer-brand-text">Dicoding</span>
            <span style={{ color: 'var(--gray-400)' }}>×</span>
            <span className="footer-brand-text">DBS Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
