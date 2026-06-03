'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/components/Detail.module.css';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/db';

const TAG_LABELS = {
  'kursi-roda': { label: '♿ Kursi Roda', cls: 'tag-green' },
  lansia: { label: '👴 Lansia', cls: 'tag-amber' },
  keluarga: { label: '👨‍👩‍👧 Keluarga', cls: 'tag-blue' },
  penglihatan: { label: '👁 Penglihatan', cls: 'tag-purple' },
};

export default function Detail({ dest, onNavigate, onShowLogin, onShowReviewModal, refreshKey }) {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('fisik');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    if (dest) {
      fetchReviews();
    }
  }, [dest, refreshKey]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            name,
            avatar_url
          )
        `)
        .eq('destination_id', dest.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDynamicReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  if (!dest) return null;

  // Filter reviews based on AI label if needed, but for now show all dynamic reviews
  // Mapping dynamic reviews to the format used in UI
  const displayReviews = dynamicReviews.map(r => ({
    id: r.id,
    name: r.users?.name || 'Anonymous',
    avatar: r.users?.avatar_url || 'https://i.pravatar.cc/36',
    meta: `Pengunjung · ${new Date(r.created_at).toLocaleDateString()}`,
    label: r.ai_label === 'positif' ? 'positif' : 'negatif',
    labelText: r.ai_label === 'positif' ? '✦ Ramah Disabilitas' : '⚠️ Akses Terbatas',
    text: r.review_text,
    photo: r.photo_url,
    insight: `AI: Terklasifikasi "${r.ai_label === 'positif' ? 'Ramah Disabilitas' : 'Akses Terbatas'}" (${Math.round(r.ai_confidence * 100)}%)`,
  }));

  const tabConfig = [
    { key: 'semua', label: '💬 Semua Ulasan' },
  ];

  return (
    <>
      <div className={styles.detailPage}>
        {/* GALLERY */}
        {galleryOpen && (
          <div className={styles.galleryModal} onClick={() => setGalleryOpen(false)}>
            <button className={styles.galleryModalClose} onClick={() => setGalleryOpen(false)}>✕</button>
            <button className={styles.galleryModalPrev} onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex - 1 + dest.imgs.length) % dest.imgs.length); }}>‹</button>
            <img
              src={dest.imgs[galleryIndex]}
              alt={dest.name}
              className={styles.galleryModalImg}
              onClick={(e) => e.stopPropagation()}
            />
            <button className={styles.galleryModalNext} onClick={(e) => { e.stopPropagation(); setGalleryIndex((galleryIndex + 1) % dest.imgs.length); }}>›</button>
            <div className={styles.galleryModalCounter}>{galleryIndex + 1} / {dest.imgs.length}</div>
          </div>
        )}
        <div className={styles.detailGallery}>
          <div className={styles.galleryMain} onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }} style={{ cursor: 'pointer' }}>
            <img src={dest.imgs[0]} alt={dest.name} />
            <div className={styles.galleryViewBtn}>🔍 Lihat Foto</div>
          </div>
          <div className={styles.gallerySide}>
            <img src={dest.imgs[1]} alt="" style={{ cursor: 'pointer' }} onClick={() => { setGalleryIndex(1); setGalleryOpen(true); }} />
            <div className={styles.galleryLast}>
              <img src={dest.imgs[2]} alt="" />
              <div className={styles.galleryOverlay} onClick={() => { setGalleryIndex(2); setGalleryOpen(true); }}>
                <span>+{dest.imgs.length - 3} Foto · Lihat Semua</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailBody}>
          <div className={styles.detailTop}>
            <div>
              <div className={styles.detailTitle}>{dest.name}</div>
              <div className={styles.detailTags}>
                {dest.tags.map((t) => {
                  const info = TAG_LABELS[t] || { label: t, cls: 'tag-green' };
                  return <span key={t} className={`tag ${info.cls}`}>{info.label}</span>;
                })}
              </div>
              <div className={styles.detailDesc}>{dest.desc}</div>
            </div>
            <div>
              <div className={styles.accessBadge}>
                <div className={styles.accessDot} />
                <span>Status Aksesibilitas: {dest.aiLabel === 'positif' ? 'Sangat Ramah' : 'Perlu Peningkatan'}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailMeta}>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Ketinggian</div>
              <div className={styles.metaVal}>{dest.alt}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Suhu Rata-rata</div>
              <div className={styles.metaVal}>{dest.temp}</div>
            </div>
            <div className={styles.metaItem}>
              <div className={styles.metaLabel}>Waktu Terbaik</div>
              <div className={styles.metaVal}>{dest.time}</div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className={styles.reviewsSection}>
            <div className={styles.reviewsHeader}>
              <h2>Analisis Ulasan Pengunjung</h2>
              <span className={styles.aiBadge}>⚡ AI Powered</span>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>
              Data diproses secara real-time dari ribuan ulasan terbaru.
            </p>

            <div className={styles.reviewTabs}>
              {tabConfig.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.reviewTab} ${activeTab === t.key ? styles.reviewTabActive : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

          <div className={styles.reviewsGrid}>
  {loadingReviews ? (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        gridColumn: 'span 2',
      }}
    >
      Memuat ulasan...
    </div>
  ) : displayReviews.length > 0 ? (
    displayReviews.map((r) => (
      <div key={r.id} className={styles.reviewCard}>
        <div>
          <span
            className={`${styles.reviewLabel} ${
              r.label === 'positif'
                ? styles.labelPositive
                : r.label === 'negatif'
                ? styles.labelNegative
                : styles.labelNote
            }`}
          >
            {r.labelText}
          </span>
        </div>

        <div className={styles.reviewer}>
          <img
            className={styles.reviewerAvatar}
            src={r.avatar}
            alt={r.name}
            referrerPolicy="no-referrer"
          />
          <div>
            <div className={styles.reviewerName}>{r.name}</div>
            <div className={styles.reviewerMeta}>{r.meta}</div>
          </div>
        </div>

        <div className={styles.reviewText}>
          {r.text}
        </div>

        {r.photo && (
          <img
            src={r.photo}
            alt="Foto Review"
            style={{
              width: '100%',
              borderRadius: '12px',
              marginTop: '12px',
            }}
          />
        )}

        <div className={styles.aiInsight}>
          ⚡ {r.insight}
        </div>
      </div>
    ))
  ) : (
    <div
      style={{
        textAlign: 'center',
        padding: '40px',
        gridColumn: 'span 2',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--gray-500)',
      }}
    >
      Belum ada ulasan untuk tempat ini. Jadilah yang pertama memberikan ulasan!
    </div>
  )}

              {/* CTA Card */}
              <div className={`${styles.reviewCard} ${styles.reviewCardCta}`}>
                <h4>Bagikan Pengalaman Anda</h4>
                <p>Ulasan Anda membantu sesama wisatawan difabel merencanakan perjalanan yang lebih baik.</p>
                <button
                  className={styles.btnWriteReview}
                  onClick={() => {
                    if (!isLoggedIn) { onShowLogin(); return; }
                    onShowReviewModal();
                  }}
                >
                  ✍ Tulis Ulasan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
