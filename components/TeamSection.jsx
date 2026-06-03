import styles from '@/styles/components/TeamSection.module.css';
import Footer from './Footer';
import { TEAM_CATEGORIES } from '@/data/destinations';

export default function TeamSection() {
  return (
    <>
      <div className={styles.teamHeader}>
        <h1>Tim Pengembang TripWell</h1>
        <div className={styles.teamId}>ID Tim Capstone: CC26-PSU116</div>
      </div>

      <div className={styles.teamSection}>
        <div className={styles.teamGrid}>
          {TEAM_CATEGORIES.map((cat) => (
            <div key={cat.label} className={styles.teamCategory}>
              <div className={styles.teamCategoryLabel}>
                <span className={styles.teamCategoryIcon}>{cat.icon}</span>
                <span style={{ color: cat.color }}>{cat.label}</span>
              </div>
              <div className={styles.teamMembersRow}>
                {cat.members.map((m) => (
                  <div key={m.id} className={styles.teamCard}>
                    {/* Top colored area with avatar */}
                    <div className={styles.teamCardBanner} style={{ background: m.color }}>
                      {m.photo ? (
                        <img
                          className={styles.teamAvatarLarge}
                          src={m.photo}
                          alt={m.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={styles.teamInitialsLarge}
                        style={{ display: m.photo ? 'none' : 'flex' }}
                      >
                        {m.initials}
                      </div>
                    </div>

                    {/* Card content */}
                    <div className={styles.teamCardContent}>
                      <div className={styles.teamName}>{m.name}</div>
                      <div className={styles.teamId2}>ID: {m.id}</div>

                      <div className={styles.teamDivider} />

                      <div className={styles.teamInfoRow}>
                        <span>🏛</span> {m.univ}
                      </div>
                      <div className={styles.teamInfoRow}>
                        <span>📚</span> {m.prodi}
                      </div>

                      <div className={styles.teamSocials}>
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.socialBtn} ${styles.socialLinkedin}`}
                          title="LinkedIn"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                          </svg>
                        </a>
                        <a
                          href={m.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.socialBtn} ${styles.socialInstagram}`}
                          title="Instagram"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                          </svg>
                        </a>
                        <a
                          href={m.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.socialBtn} ${styles.socialGithub}`}
                          title="GitHub"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
