import Link from 'next/link';
import { Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.column}>
          <h3 className={styles.title}>Dachdeckerei The Roof</h3>
          <p className={styles.text}>
            Richard Rohacek<br/>
            Dachdeckermeister
          </p>
          <div className={styles.contactItem} style={{ marginTop: '1rem' }}>
            <MapPin size={18} className={styles.icon} />
            <span>Rauscherstraße 4<br/>1200 Wien</span>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Quick Links</h3>
          <nav className={styles.nav}>
            <Link href="/" className={styles.link}>Startseite</Link>
            <Link href="/#leistungen" className={styles.link}>Leistungen</Link>
            <Link href="/#spezial" className={styles.link}>Spezialgebiete</Link>
            <Link href="/#referenzen" className={styles.link}>Referenzen</Link>
            <Link href="/#kontakt" className={styles.link}>Kontakt</Link>
            <Link href="/admin" className={styles.link}>Admin Dashboard</Link>
          </nav>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Kontakt</h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Phone size={18} className={styles.icon} />
              <span>01 / 333 98 98</span>
            </div>
            <div className={`${styles.contactItem} ${styles.emergency}`}>
              <AlertTriangle size={18} className={styles.iconAlert} />
              <span>Notdienst: 0664 / 160 08 72</span>
            </div>
            <div className={styles.contactItem}>
              <Mail size={18} className={styles.icon} />
              <a href="mailto:the.roof@chello.at" className={styles.link}>the.roof@chello.at</a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p>&copy; 2025 Dachdeckerei The Roof. Alle Rechte vorbehalten. UID: ATU 46939309</p>
      </div>
    </footer>
  );
}
