'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'Startseite', href: '/' },
  { label: 'Leistungen', href: '/#leistungen' },
  { label: 'Spezial', href: '/#spezial' },
  { label: 'Referenzen', href: '/#referenzen' },
  { label: 'Kontakt', href: '/#kontakt' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          🏠 THE ROOF
        </Link>

        <nav className={styles.nav} aria-label="Hauptnavigation">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.navLink}>
              {label}
            </Link>
          ))}
          <Link href="/termin" className={`btn btn-primary btn-sm ${styles.cta}`}>
            Termin buchen
          </Link>
        </nav>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={menuOpen}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      <nav className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`} aria-label="Mobile Navigation">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link key={href} href={href} className={styles.mobileNavLink} onClick={closeMenu}>
            {label}
          </Link>
        ))}
        <Link href="/termin" className={`btn btn-primary btn-lg ${styles.mobileCta}`} onClick={closeMenu}>
          Termin buchen
        </Link>
      </nav>
    </header>
  );
}
