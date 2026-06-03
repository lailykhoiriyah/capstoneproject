'use client';

import { useState } from 'react';
import styles from '@/styles/components/Navbar.module.css';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ activePage, onNavigate, onShowLogin }) {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: 'beranda', label: 'Beranda' },
    { key: 'destinasi', label: 'Destinasi' },
    { key: 'team', label: 'Team' },
  ];

  const handleNav = (key) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={styles.nav}>
        <button className={styles.navLogo} onClick={() => handleNav('beranda')}>
          <img
            src="/aset/images/tripwell_logo.jpeg"
            alt="TripWell"
            className={styles.logoImg}
          />
        </button>

        <div className={styles.navLinks}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`${styles.navLink} ${activePage === item.key ? styles.navLinkActive : ''}`}
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.navRight}>
          <button className={styles.darkToggle} onClick={toggleTheme} title="Toggle Dark/Light Mode">
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <div className={styles.toggleTrack}>
              <div className={styles.toggleThumb} />
            </div>
          </button>

          {isLoggedIn && currentUser ? (
            <div className={styles.userChip} onClick={logout}>
              <img 
                src={currentUser.image} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
              />
              {currentUser.name}
            </div>
          ) : (
            <button className={styles.btnLogin} onClick={onShowLogin}>
              Masuk
            </button>
          )}

          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`${styles.navLink} ${activePage === item.key ? styles.navLinkActive : ''}`}
              onClick={() => handleNav(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
