'use client';

import { useState } from 'react';
import styles from '@/styles/components/DestinationList.module.css';
import DestinationCard from './DestinationCard';
import Footer from './Footer';
import { DESTINATIONS } from '@/data/destinations';

const ITEMS_PER_PAGE = 6;

const AI_FILTERS = [
  { id: 'f5', value: 'positif', label: 'Ramah Disabilitas' },
  { id: 'f6', value: 'negatif', label: 'Akses Terbatas' },
];

export default function DestinationList({ onNavigate, onShowDetail }) {
  const [aiFilters, setAiFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleFilter = (value, arr, setArr) => {
    setArr((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setAiFilters([]);
    setCurrentPage(1);
  };

  const filtered = DESTINATIONS.filter((d) => {
    const aiOk = aiFilters.length === 0 || aiFilters.includes(d.aiLabel);
    return aiOk;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build page numbers to show: always show 1, current-1, current, current+1, last
  const getPageNumbers = () => {
    if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages]);
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.add(i);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);
    // Insert dots
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      result.push(sorted[i]);
      if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
        result.push('...');
      }
    }
    return result;
  };

  return (
    <>
      <div className={styles.destHeader}>
        <div className={styles.breadcrumb}>
          Beranda &rsaquo; <span>Destinasi</span>
        </div>
        <h1>Daftar Wisata Alam Bandung Barat</h1>
        <p>Menjelajah keindahan alam yang inklusif untuk semua kalangan.</p>
      </div>

      <div className={styles.destLayout}>
        {/* FILTER PANEL */}
        <div className={styles.filterPanel}>
          <div className={styles.filterTitle}>Filter</div>

          <div className={styles.filterGroup}>
            <h4>Ulasan AI</h4>
            {AI_FILTERS.map((f) => (
              <div key={f.id} className={styles.filterOption}>
                <input
                  type="checkbox"
                  id={f.id}
                  checked={aiFilters.includes(f.value)}
                  onChange={() => toggleFilter(f.value, aiFilters, setAiFilters)}
                />
                <label htmlFor={f.id}>{f.label}</label>
              </div>
            ))}
          </div>

          <button className={styles.btnReset} onClick={resetFilters}>
            Reset Filter
          </button>
        </div>

        {/* CARDS */}
        <div>
          <div className={styles.destCount}>
            Menampilkan{' '}
            <strong>
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length}
            </strong>{' '}
            destinasi alam
          </div>
          <div className={styles.cardsGrid}>
            {paginated.map((dest) => (
              <DestinationCard key={dest.id} dest={dest} onShowDetail={onShowDetail} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageBtn}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>

              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className={styles.pageDots}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className={styles.pageBtn}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
