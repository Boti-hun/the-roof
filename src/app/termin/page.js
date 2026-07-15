'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, Layers, FileText, Hammer, Flame, Paintbrush, Grid3X3, Wrench, HelpCircle,
  Building2, Monitor, CheckCircle, ChevronRight, ChevronLeft, ChevronDown
} from 'lucide-react';
import styles from './page.module.css';

const SERVICES = [
  { id: 'Dacheindeckungen', icon: Home, title: 'Dacheindeckungen' },
  { id: 'Flachdach & Terrasse', icon: Layers, title: 'Flachdach & Terrasse' },
  { id: 'Foliendeckungen', icon: FileText, title: 'Foliendeckungen' },
  { id: 'Ziegeldach-Sanierung', icon: Hammer, title: 'Ziegeldach-Sanierung' },
  { id: 'Kaminsanierung', icon: Flame, title: 'Kaminsanierung' },
  { id: 'Blecharbeiten', icon: Paintbrush, title: 'Blecharbeiten' },
  { id: 'Dachflächenfenster', icon: Grid3X3, title: 'Dachflächenfenster' },
  { id: 'Spengler & Plattenleger', icon: Wrench, title: 'Spengler & Plattenleger' },
  { id: 'Sonstiges', icon: HelpCircle, title: 'Sonstiges' }
];

const LOCATIONS = [
  { id: 'Vor Ort', icon: Building2, title: 'Vor Ort', desc: 'Besichtigung bei Ihnen vor Ort' },
  { id: 'Online', icon: Monitor, title: 'Online', desc: 'Video-Besprechung online' }
];

const HOURS = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
const MINUTES = ['00', '15', '30', '45'];

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export default function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form data
  const [data, setData] = useState({
    service: '',
    location: '',
    date: getTodayString(),
    timeHour: '',
    timeMinute: '',
    name: '',
    email: '',
    countryCode: '+43',
    phone: '',
    address: '',
    message: ''
  });

  // Autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  useEffect(() => {
    if (data.address.length > 3 && showSuggestions) {
      setIsSearchingAddress(true);
      const delayFn = setTimeout(async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=at&limit=5&q=${encodeURIComponent(data.address)}`);
          if (res.ok) {
            const results = await res.json();
            setAddressSuggestions(results);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearchingAddress(false);
        }
      }, 400);
      return () => clearTimeout(delayFn);
    } else {
      setAddressSuggestions([]);
      setIsSearchingAddress(false);
    }
  }, [data.address, showSuggestions]);

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleNext = () => {
    if (step === 1 && !data.service) return;
    if (step === 2 && (!data.location || !data.date || !data.timeHour || !data.timeMinute)) return;
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.phone || !data.address) {
      setErrorMsg('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(data.email)) {
      setErrorMsg('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, timePreference: `${data.timeHour}:${data.timeMinute}`, phone: `${data.countryCode} ${data.phone}` })
      });
      if (res.ok) {
        setStep(4);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || 'Fehler bei der Buchung.');
      }
    } catch (err) {
      setErrorMsg('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    }
    setIsSubmitting(false);
  };

  const renderProgressBar = () => (
    <div className={styles.progressBar}>
      <div className={styles.progressStep}>
        <div className={`${styles.progressCircle} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
          {step > 1 ? <CheckCircle size={20} /> : '1'}
        </div>
        <span className={`${styles.progressLabel} ${step >= 1 ? styles.active : ''}`}>Leistung</span>
      </div>
      <div className={`${styles.progressLine} ${step >= 2 ? styles.completed : ''}`} />
      
      <div className={styles.progressStep}>
        <div className={`${styles.progressCircle} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
          {step > 2 ? <CheckCircle size={20} /> : '2'}
        </div>
        <span className={`${styles.progressLabel} ${step >= 2 ? styles.active : ''}`}>Details</span>
      </div>
      <div className={`${styles.progressLine} ${step >= 3 ? styles.completed : ''}`} />

      <div className={styles.progressStep}>
        <div className={`${styles.progressCircle} ${step >= 3 ? styles.active : ''} ${step > 3 ? styles.completed : ''}`}>
          {step > 3 ? <CheckCircle size={20} /> : '3'}
        </div>
        <span className={`${styles.progressLabel} ${step >= 3 ? styles.active : ''}`}>Kontakt</span>
      </div>
    </div>
  );

  return (
    <div className={`container ${styles.pageWrapper}`}>
      {step < 4 && renderProgressBar()}

      {step === 1 && (
        <div className={styles.stepContent}>
          <h1 className={styles.stepTitle}>Welche Leistung benötigen Sie?</h1>
          <div className={styles.serviceGrid}>
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const isSelected = data.service === s.id;
              return (
                <div
                  key={s.id}
                  className={`glass-card ${styles.serviceCard} ${isSelected ? styles.serviceCardSelected : ''}`}
                  onClick={() => updateData('service', s.id)}
                >
                  {isSelected && <CheckCircle className={styles.serviceCardCheck} size={24} />}
                  <Icon className={styles.serviceIcon} size={48} />
                  <span style={{ fontWeight: 600 }}>{s.title}</span>
                </div>
              );
            })}
          </div>
          <div className={styles.buttonRow}>
            <div /> {/* Spacer */}
            <button className="btn btn-primary" onClick={handleNext} disabled={!data.service}>
              Weiter <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent}>
          <h1 className={styles.stepTitle}>Wann und wo sollen wir uns treffen?</h1>
          
          <div className={styles.locationGrid}>
            {LOCATIONS.map((l) => {
              const Icon = l.icon;
              const isSelected = data.location === l.id;
              return (
                <div
                  key={l.id}
                  className={`glass-card ${styles.locationCard} ${isSelected ? styles.locationCardSelected : ''}`}
                  onClick={() => updateData('location', l.id)}
                >
                  {isSelected && <CheckCircle className={styles.serviceCardCheck} size={24} />}
                  <Icon className={styles.serviceIcon} size={48} />
                  <div className={styles.locationCardTitle}>{l.title}</div>
                  <div className={styles.locationCardDesc}>{l.desc}</div>
                </div>
              );
            })}
          </div>

          <div className={styles.formRowDouble}>
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Wunschdatum</label>
              <input
                type="date"
                className="form-input"
                min={getTodayString()}
                max="2030-12-31"
                value={data.date}
                onChange={(e) => updateData('date', e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Stunde</label>
                <select className="form-select" value={data.timeHour} onChange={e => updateData('timeHour', e.target.value)}>
                  <option value="" disabled>HH</option>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Minute</label>
                <select className="form-select" value={data.timeMinute} onChange={e => updateData('timeMinute', e.target.value)}>
                  <option value="" disabled>MM</option>
                  {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button className="btn btn-secondary" onClick={handleBack}>
              <ChevronLeft size={18} /> Zurück
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!data.location || !data.date || !data.timeHour || !data.timeMinute}
            >
              Weiter <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepContent}>
          <h1 className={styles.stepTitle}>Wie können wir Sie erreichen?</h1>
          
          {errorMsg && (
            <div className="badge badge-error" style={{ marginBottom: '1rem', width: '100%', justifyContent: 'center', padding: '1rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.formRowDouble}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                  placeholder="Max Mustermann"
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>E-Mail *</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={data.email}
                  onChange={(e) => updateData('email', e.target.value)}
                  placeholder="max@beispiel.at"
                />
              </div>
            </div>

            <div className={styles.formRowDouble}>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>Telefon *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={data.countryCode}
                    onChange={(e) => updateData('countryCode', e.target.value)}
                    style={{ width: '80px', flexShrink: 0, textAlign: 'center' }}
                  />
                  <input
                    type="tel"
                    className="form-input"
                    required
                    value={data.phone}
                    onChange={(e) => updateData('phone', e.target.value)}
                    placeholder="664 1234567"
                    style={{ flexGrow: 1 }}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel}>
                  Adresse (Wien & Umgebung) * {isSearchingAddress && <span style={{color: 'var(--accent-primary)', fontSize: '0.85em', marginLeft: '4px'}}>Lädt...</span>}
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={data.address}
                  onChange={(e) => {
                    updateData('address', e.target.value);
                    setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Straße Hausnummer, PLZ Ort"
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className={styles.addressSuggestions}>
                    {addressSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className={styles.addressItem}
                        onClick={() => {
                          updateData('address', item.display_name);
                          setShowSuggestions(false);
                        }}
                      >
                        {item.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.formLabel}>Nachricht (optional)</label>
              <textarea
                className="form-textarea"
                value={data.message}
                onChange={(e) => updateData('message', e.target.value)}
                placeholder="Geben Sie hier weitere Details zu Ihrem Projekt an..."
              />
            </div>

            <div className={styles.buttonRow}>
              <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                <ChevronLeft size={18} /> Zurück
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Wird gesendet...' : 'Termin anfragen'} <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className={`${styles.stepContent} ${styles.confirmation} animate-fade-in`}>
          <svg className={styles.checkmarkSvg} width="100" height="100" viewBox="0 0 100 100" style={{ marginBottom: '1rem' }}>
            <circle cx="50" cy="50" r="46" fill="transparent" stroke="var(--status-success)" strokeWidth="6" strokeDasharray="289" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" from="289" to="0" dur="0.6s" ease="ease-out" />
            </circle>
            <path d="M 30 50 L 45 65 L 70 35" fill="transparent" stroke="var(--status-success)" strokeWidth="6" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="0">
              <animate attributeName="stroke-dashoffset" from="60" to="0" dur="0.4s" begin="0.6s" ease="ease-out" fill="freeze" />
            </path>
          </svg>
          
          <h1 className={styles.confirmationTitle}>Vielen Dank!</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.
          </p>

          <div className={`glass-card ${styles.summaryCard}`}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Leistung</span>
              <span className={styles.summaryValue}>{data.service}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Datum</span>
              <span className={styles.summaryValue}>{data.date}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Zeit</span>
              <span className={styles.summaryValue}>{data.timeHour}:{data.timeMinute}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Ort</span>
              <span className={styles.summaryValue}>{data.location}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Name</span>
              <span className={styles.summaryValue}>{data.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>E-Mail</span>
              <span className={styles.summaryValue}>{data.email}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Telefon</span>
              <span className={styles.summaryValue}>{data.countryCode} {data.phone}</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => router.push('/')} style={{ marginTop: '2rem' }}>
            Zurück zur Startseite
          </button>
        </div>
      )}
    </div>
  );
}
