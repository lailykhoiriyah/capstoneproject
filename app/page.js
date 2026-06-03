'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DestinationList from '@/components/DestinationList';
import Detail from '@/components/Detail';
import TeamSection from '@/components/TeamSection';
import { LoginModal, ReviewModal } from '@/components/Modal';

export default function Home() {
  const [activePage, setActivePage] = useState('beranda');
  const [currentDest, setCurrentDest] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showDetail = (dest) => {
    setCurrentDest(dest);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSuccess = () => {
    setRefreshReviews(prev => prev + 1);
  };

  return (
    <>
      <Navbar
        activePage={activePage}
        onNavigate={navigate}
        onShowLogin={() => setShowLogin(true)}
      />

      <main style={{ paddingTop: 64 }}>
        {activePage === 'beranda' && (
          <Hero onNavigate={navigate} onShowDetail={showDetail} />
        )}

        {activePage === 'destinasi' && (
          <DestinationList onNavigate={navigate} onShowDetail={showDetail} />
        )}

        {activePage === 'detail' && (
          <Detail
            dest={currentDest}
            onNavigate={navigate}
            onShowLogin={() => setShowLogin(true)}
            onShowReviewModal={() => setShowReview(true)}
            refreshKey={refreshReviews}
          />
        )}

        {activePage === 'team' && <TeamSection />}
      </main>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <ReviewModal 
        isOpen={showReview} 
        onClose={() => setShowReview(false)} 
        dest={currentDest}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}
