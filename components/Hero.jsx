'use client';

import { useState } from 'react';
import styles from '@/styles/components/Hero.module.css';
import DestinationCard from './DestinationCard';
import { DESTINATIONS } from '@/data/destinations';
import Footer from './Footer';

const STATS = [
  { num: '83%', label: 'Kepuasan Pengguna' },
  { num: '20+', label: 'Lokasi Terverifikasi' },
  { num: '2K+', label: 'Ulasan Pengguna' },
  { num: '24/7', label: 'Bantuan Akses' },
];

export default function Hero({ onNavigate, onShowDetail }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [accFilter, setAccFilter] = useState('');

  // Filter destinations based on search query and accessibility filter
  const searchResults = DESTINATIONS.filter((d) => {
    const matchQuery =
      searchQuery.trim() === '' ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = accFilter === '' || d.tags.includes(accFilter);
    return matchQuery && matchFilter;
  });

  const isSearching = searchQuery.trim() !== '' || accFilter !== '';
  const featured = isSearching ? searchResults : DESTINATIONS.slice(0, 3);

  const handleSearch = () => {
    if (isSearching) return; // already showing results inline
    onNavigate('destinasi');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>✦ Wisata Inklusif Bandung Barat</span>
          <h1 className={styles.heroTitle}>Eksplorasi Alam Tanpa Hambatan</h1>
          <p className={styles.heroDesc}>
            Kami memastikan setiap perjalanan Anda aman, nyaman, dan dapat diakses oleh semua kalangan termasuk difabel, lansia, dan keluarga.
          </p>
          <div className={styles.heroSearch}>
            <input
              type="text"
              placeholder="Cari destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.searchDivider} />
            <select value={accFilter} onChange={(e) => setAccFilter(e.target.value)}>
              <option value="">Semua Kebutuhan</option>
              <option value="kursi-roda">Akses Kursi Roda</option>
              <option value="lansia">Ramah Lansia</option>
              <option value="keluarga">Ramah Keluarga</option>
            </select>
            <button className={styles.btnSearch} onClick={handleSearch}>
              🔍 Temukan
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS / FEATURED */}
      <div className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.sectionTitle}>
              {isSearching ? 'Hasil Pencarian' : 'Destinasi Unggulan'}
            </div>
            <div className={styles.sectionSub}>
              {isSearching
                ? `Ditemukan ${searchResults.length} destinasi${searchQuery ? ` untuk "${searchQuery}"` : ''}`
                : 'Pilihan terbaik untuk petualangan tanpa hambatan.'}
            </div>
          </div>
          {!isSearching && (
            <button className={styles.seeAll} onClick={() => onNavigate('destinasi')}>
              Lihat Semua →
            </button>
          )}
          {isSearching && (
            <button
              className={styles.seeAll}
              onClick={() => { setSearchQuery(''); setAccFilter(''); }}
            >
              ✕ Reset
            </button>
          )}
        </div>

        {isSearching && searchResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 16 }}>Tidak ada destinasi yang cocok dengan pencarian Anda.</p>
            <button
              onClick={() => { setSearchQuery(''); setAccFilter(''); }}
              style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, border: '1px solid var(--gray-300)', background: 'transparent', cursor: 'pointer', color: 'var(--green-700)' }}
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {featured.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} onShowDetail={onShowDetail} />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaLeft}>
          <h2>Membangun Masa Depan Wisata yang Inklusif</h2>
          <p>
            Kami terus memperbarui data fasilitas di lebih dari 20 titik wisata di Bandung Barat.
            Transparansi data adalah kunci kenyamanan perjalanan Anda.
          </p>
        </div>
        <div className={styles.ctaStats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.ctaStat}>
              <div className={styles.ctaStatNum}>{s.num}</div>
              <div className={styles.ctaStatLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
