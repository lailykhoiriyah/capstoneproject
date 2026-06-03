'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
import modalStyles from '@/styles/components/Modal.module.css';

const POS_WORDS = ['mudah','nyaman','bagus','baik','ramah','aman','bersih','luas','membantu','ramp','aksesibel','landai','rata','recommended'];
const NEG_WORDS = ['sulit','jauh','curam','sempit','kotor','rusak','berbahaya','tidak bisa','susah','terbatas'];

function simulateLocalClassification(text) {
  const t = text.toLowerCase();
  let score = 0;
  POS_WORDS.forEach((w) => { if (t.includes(w)) score++; });
  NEG_WORDS.forEach((w) => { if (t.includes(w)) score--; });
  return score >= 0;
}

/* =================== LOGIN MODAL =================== */
export function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-logo">
          <img src="/aset/images/logo.png" alt="TripWell" style={{ height: 56, width: 'auto', objectFit: 'contain', marginBottom: 4 }} />
          <h2>Masuk ke TripWell</h2>
          <p className="modal-sub">Bergabunglah untuk berbagi ulasan dan membantu sesama wisatawan</p>
        </div>
        <button className="btn-google" onClick={handleLogin}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>
      </div>
    </div>
  );
}

/* =================== REVIEW MODAL =================== */
export function ReviewModal({ isOpen, onClose, dest, modelApiUrl = 'http://127.0.0.1:5000/predict', onSuccess }) {
  const [reviewText, setReviewText] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setReviewText('');
      setAiResult(null);
      setAiLoading(false);
      setIsSubmitting(false);
      setPhotoPreview(null);
    }
  }, [isOpen]);

  const analyzeReview = async (text) => {
    if (text.length < 10) {
      setAiResult(null);
      setAiLoading(false);
      return;
    }

    clearTimeout(timeoutRef.current);
    setAiLoading(true);
    setAiResult(null);

    timeoutRef.current = setTimeout(async () => {
      try {
        const resp = await fetch(modelApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: AbortSignal.timeout(3000),
        });
        const data = await resp.json();
        setAiLoading(false);
        const isPos = data.label === 'positif';
        setAiResult({
          pos: isPos,
          label: data.label || (isPos ? 'positif' : 'negatif'),
          confidence: data.confidence || 0.9,
          text: isPos
            ? '✦ AI: Ulasan ini terklasifikasi sebagai "Ramah Disabilitas"'
            : '⚠ AI: Ulasan ini terklasifikasi sebagai "Akses Terbatas"',
        });
      } catch (err) {
        console.error("AI Analysis Error:", err);
        setAiLoading(false);
        const sentiment = simulateLocalClassification(text);
        setAiResult({
          pos: sentiment,
          label: sentiment ? 'positif' : 'negatif',
          confidence: 0.51, // Sedikit diubah agar terlihat bedanya dengan fallback murni
          text: 'AI Lokal (Gagal terhubung ke Server)',
        });
      }
    }, 1200);
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setReviewText(val);
    analyzeReview(val);
  };

 const handlePhotoChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setPhoto(file);

  const reader = new FileReader();

  reader.onload = (ev) => {
    setPhotoPreview(ev.target.result);
  };

  reader.readAsDataURL(file);
};

  const clearPhoto = (e) => {
    e.stopPropagation();
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

const uploadPhoto = async (file) => {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from('review-images')
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from('review-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

  const handleSubmit = async () => {
try {
  const [photo, setPhoto] = useState(null);
      let photoUrl = null;
       if (photo) {
          photoUrl = await uploadPhoto(photo);
}
      await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destination_id: String(dest?.id || 'unknown'),
    destination_name: dest?.name || 'Unknown Destination',
    review_text: reviewText,
    ai_label: aiResult?.label || 'unclassified',
    ai_confidence: aiResult?.confidence || 0,
    photo_url: photoUrl,
  }),
});

      if (response.ok) {
        alert('✅ Ulasan Anda berhasil dikirim ke Supabase! Terima kasih!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await response.json();
        alert(`❌ Gagal mengirim ulasan: ${errData.error}\n\nDetail: ${errData.details || 'Tidak ada detail'}\n\nHint: ${errData.hint || ''}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert('❌ Terjadi kesalahan jaringan saat mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`modal ${modalStyles.reviewModalContent}`}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Tulis Ulasan</h2>
        <p>Bagikan pengalaman aksesibilitas Anda untuk membantu sesama wisatawan.</p>

        <textarea
          className={modalStyles.reviewInput}
          placeholder="Ceritakan pengalaman Anda tentang aksesibilitas tempat ini..."
          value={reviewText}
          onChange={handleTextChange}
        />

        <div className={modalStyles.aiSection}>
          <h3>Analisis AI Otomatis</h3>
          {aiLoading ? (
            <div className={modalStyles.aiLoading}>
              <div className={modalStyles.spinner} />
              <span>AI sedang menganalisis ulasan Anda...</span>
            </div>
          ) : aiResult ? (
            <div className={`${modalStyles.aiResultBadge} ${aiResult.pos ? modalStyles.aiResultPos : modalStyles.aiResultNeg}`}>
              <span className={modalStyles.aiIcon}>
                {aiResult.pos ? '✨' : '⚠️'}
              </span>
              <div className={modalStyles.aiText}>
                {aiResult.pos ? 'Ramah Disabilitas' : 'Akses Terbatas'}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.6, fontWeight: 400 }}>
                {Math.round(aiResult.confidence * 100)}% yakin
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--gray-400)', fontStyle: 'italic' }}>
              Tulis minimal 10 karakter untuk melihat analisis AI otomatis.
            </p>
          )}
        </div>

        {/* Photo Upload */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        <div
          className={modalStyles.photoUploadArea}
          onClick={() => fileInputRef.current?.click()}
        >
          {photoPreview ? (
            <div className={modalStyles.photoPreview}>
              <img src={photoPreview} alt="Preview" />
              <button className={modalStyles.photoClearBtn} onClick={clearPhoto}>✕</button>
            </div>
          ) : (
            <div className={modalStyles.photoPlaceholder}>
              <span style={{ fontSize: 28 }}>📷</span>
              <span>Tambahkan foto (opsional)</span>
              <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Klik untuk memilih foto</span>
            </div>
          )}
        </div>

        <div className={modalStyles.modalBtns}>
          <button className={modalStyles.btnCancel} onClick={onClose} disabled={isSubmitting}>Batal</button>
          <button 
            className={modalStyles.btnSubmit} 
            onClick={handleSubmit} 
            disabled={isSubmitting || reviewText.trim().length < 10}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== GALLERY MODAL =================== */
export function GalleryModal({ isOpen, onClose, images = [] }) {
  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        padding: 24,
        maxWidth: 800,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 22, marginBottom: 20 }}>
          Galeri Foto
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 8,
        }}>
          {images.map((src, i) => (
            <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 8 }}>
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
