'use client';

import { useState } from 'react';
import styles from '@/styles/components/DestinationCard.module.css';

const TAG_LABELS = {
  'kursi-roda': { label: '♿ Kursi Roda', cls: 'tag-green' },
  lansia: { label: '👴 Lansia', cls: 'tag-amber' },
  keluarga: { label: '👨‍👩‍👧 Keluarga', cls: 'tag-blue' },
  penglihatan: { label: '👁 Penglihatan', cls: 'tag-purple' },
};

export default function DestinationCard({ dest, onShowDetail }) {
  const [fav, setFav] = useState(false);

  return (
    <div className={styles.destCard} onClick={() => onShowDetail(dest)}>
      <div className={styles.cardImg}>
        <img src={dest.img} alt={dest.name} />
        <div className={styles.cardRating}>⭐ {dest.rating}</div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{dest.name}</div>
        <div className={styles.cardLoc}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          {dest.loc}
        </div>
        <div className={styles.cardTags}>
          {dest.tags.map((t) => {
            const info = TAG_LABELS[t] || { label: t, cls: 'tag-green' };
            return (
              <span key={t} className={`tag ${info.cls}`}>{info.label}</span>
            );
          })}
          <span className={`tag ${dest.aiLabel === 'positif' ? 'tag-green' : 'tag-red'}`}>
            {dest.aiLabel === 'positif' ? '✦ AI: Ramah' : '⚠ AI: Terbatas'}
          </span>
        </div>
        <div className={styles.cardFooter}>
          <button
            className={`${styles.btnFav} ${fav ? styles.btnFavActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setFav((v) => !v);
            }}
            aria-label="Favorit"
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
}
