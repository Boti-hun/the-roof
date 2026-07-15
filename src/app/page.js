'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Home,
  Layers,
  FileText,
  Hammer,
  Flame,
  Paintbrush,
  Grid3X3,
  Wrench,
  CheckCircle,
  MapPin,
  Phone,
  AlertTriangle,
  Mail,
  PhoneCall
} from 'lucide-react';
import styles from './page.module.css';

const SERVICES = [
  { icon: Home, title: 'Dacheindeckungen', desc: 'Dacheindeckungen jeglicher Art — Ziegel, Schiefer, Metall und mehr' },
  { icon: Layers, title: 'Flachdach & Terrasse', desc: 'Flachdach und Terrassenisolierungen mit modernsten Materialien' },
  { icon: FileText, title: 'Foliendeckungen', desc: 'Hochwertige Folienabdichtungen für langfristigen Schutz' },
  { icon: Hammer, title: 'Ziegeldach-Sanierung', desc: 'Fachgerechte Sanierung von alten Ziegeldächern' },
  { icon: Flame, title: 'Kaminsanierung', desc: 'Professionelle Kaminsanierung und Reparatur' },
  { icon: Paintbrush, title: 'Blecharbeiten', desc: 'Streicharbeiten von Blecheindeckungen, Dachrinnen und Blechdächern' },
  { icon: Grid3X3, title: 'Dachflächenfenster', desc: 'Fachgerechter Einbau von Dachflächenfenstern' },
  { icon: Wrench, title: 'Spengler & Plattenleger', desc: 'Sämtliche Spengler- und Plattenlegerarbeiten' },
];

const SPEZIAL = ['Dächer', 'Gründächer', 'Biotope', 'Swimmingpools'];

const GALLERY = [
  { src: '/hero.jpg', alt: 'Dachdeckerei Projekt 1' },
  { src: '/worker.jpg', alt: 'Dachdeckerei Projekt 2' },
  { src: '/flatroof.jpg', alt: 'Dachdeckerei Projekt 3' },
  { src: '/chimney.jpg', alt: 'Dachdeckerei Projekt 4' },
  { src: '/green-roof.jpg', alt: 'Dachdeckerei Projekt 5' },
];

export default function HomePage() {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/hero.jpg"
            alt="Dachdeckerei The Roof Hintergrund"
            fill
            priority
            unoptimized
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.heroContent}>
          <div className={`${styles.heroBadge} animate-fade-in`}>
            <PhoneCall size={18} />
            <span>24/7 Notdienst: 0664/160 08 72</span>
          </div>
          <h1 className={`${styles.heroTitle} animate-fade-in-up delay-1`}>
            Dachdeckerei <span className={styles.heroHighlight}>The Roof</span>
          </h1>
          <p className={`${styles.heroSubtitle} animate-fade-in-up delay-2`}>
            Ihr Dachdeckermeister in Wien seit über 20 Jahren. Fachbetrieb für Dacheindeckungen, Isolierungen und Kaminsanierung.
          </p>
          <div className={`${styles.heroButtons} animate-fade-in-up delay-3`}>
            <Link href="/termin" className="btn btn-primary btn-lg">
              Termin vereinbaren
            </Link>
            <a href="tel:06641600872" className="btn btn-secondary btn-lg">
              Notdienst anrufen
            </a>
          </div>
        </div>
      </section>

      <section id="leistungen" className="section container">
        <div className="reveal" style={{ opacity: 0 }}>
          <h2 className="section-title">Unsere Leistungen</h2>
          <p className="section-subtitle">Professionelle Dachdeckerarbeiten für Wien und Umgebung</p>
        </div>
        <div className={`reveal ${styles.servicesMarqueeWrapper}`} style={{ opacity: 0 }}>
          <div className={styles.servicesMarquee}>
            {[...SERVICES, ...SERVICES, ...SERVICES, ...SERVICES].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className={`glass-card ${styles.serviceCard}`}>
                  <div className={styles.serviceIconWrapper}>
                    <Icon size={28} />
                  </div>
                  <h3 className={styles.serviceTitle}>{s.title}</h3>
                  <p className={styles.serviceDescription}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="spezial" className="section container">
        <div className="reveal" style={{ opacity: 0 }}>
          <h2 className="section-title">Spezialgebiete</h2>
          <p className="section-subtitle">Foliendeckung für besondere Anforderungen</p>
        </div>
        <div className={styles.spezialGrid}>
          <div className={`reveal ${styles.spezialImageWrapper}`} style={{ opacity: 0 }}>
            <Image
              src="/green-roof.jpg"
              alt="Gründach Spezialisierung"
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={`reveal ${styles.spezialContent}`} style={{ opacity: 0 }}>
            <ul className={styles.spezialList}>
              {SPEZIAL.map((item, idx) => (
                <li key={idx} className={styles.spezialListItem}>
                  <CheckCircle className={styles.spezialListIcon} size={24} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className={`glass-card ${styles.spezialCallout}`}>
              <p className={styles.spezialCalloutText}>
                Kostenlose Besichtigung und persönliche Beratung durch den Meister. Kostenvoranschlag gratis!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="referenzen" className="section container">
        <div className="reveal" style={{ opacity: 0 }}>
          <h2 className="section-title">Unsere Referenzen</h2>
          <p className="section-subtitle">Ausgewählte Projekte aus Wien und Umgebung</p>
        </div>
        <div className={styles.galleryGrid}>
          {GALLERY.map((img, idx) => (
            <div key={idx} className={`glass-card reveal ${styles.galleryCard}`} style={{ opacity: 0, animationDelay: `${(idx % 3) * 0.1}s`, padding: 0 }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                unoptimized
                className={styles.galleryImage}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </section>

      <section id="kontakt" className="section container">
        <div className="reveal" style={{ opacity: 0 }}>
          <h2 className="section-title">Kontakt & Impressum</h2>
        </div>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfoGrid}>
            <div className={`glass-card reveal ${styles.contactCard}`} style={{ opacity: 0, animationDelay: '0.1s' }}>
              <div className={styles.contactIconWrapper}>
                <MapPin size={24} />
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Adresse</span>
                <span className={styles.contactValue}>Rauscherstraße 4<br/>1200 Wien</span>
              </div>
            </div>
            <div className={`glass-card reveal ${styles.contactCard}`} style={{ opacity: 0, animationDelay: '0.2s' }}>
              <div className={styles.contactIconWrapper}>
                <Phone size={24} />
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Telefon</span>
                <span className={styles.contactValue}>01 / 333 98 98</span>
              </div>
            </div>
            <div className={`glass-card reveal ${styles.contactCard}`} style={{ opacity: 0, animationDelay: '0.3s' }}>
              <div className={styles.contactIconWrapper}>
                <AlertTriangle size={24} />
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>24/7 Notdienst</span>
                <span className={styles.contactValue}>0664 / 160 08 72</span>
              </div>
            </div>
            <div className={`glass-card reveal ${styles.contactCard}`} style={{ opacity: 0, animationDelay: '0.4s' }}>
              <div className={styles.contactIconWrapper}>
                <Mail size={24} />
              </div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>E-Mail</span>
                <span className={styles.contactValue}>the.roof@chello.at</span>
              </div>
            </div>
          </div>
          
          <div className={`glass-card reveal ${styles.legalCard}`} style={{ opacity: 0, animationDelay: '0.5s' }}>
            <h3 className={styles.legalTitle}>Kostenlose Besichtigung vor Ort</h3>
            <p className={styles.legalText}>
              Dachdeckerei The Roof<br/>
              Richard Rohacek<br/>
              UID: ATU 46939309<br/>
              Handelsgericht Wien
            </p>
            <Link href="/termin" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Termin online buchen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
