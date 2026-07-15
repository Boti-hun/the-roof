'use client';

import { useState, useEffect } from 'react';
import { Search, LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from './page.module.css';

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('theroof_admin') === 'true') {
      setLoggedIn(true);
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [loggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'TheRoof' && password === 'roof2025') {
      sessionStorage.setItem('theroof_admin', 'true');
      setLoggedIn(true);
      setLoginError('');
      fetchData();
    } else {
      setLoginError('Ungültige Anmeldedaten');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('theroof_admin');
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Neu': return 'badge-pending';
      case 'Bestätigt': return 'badge-success';
      case 'Storniert': return 'badge-error';
      default: return '';
    }
  };

  const filteredData = reservations.filter(res => {
    if (filterStatus !== 'Alle' && res.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        res.name.toLowerCase().includes(term) ||
        res.email.toLowerCase().includes(term) ||
        res.phone.includes(term) ||
        res.service.toLowerCase().includes(term) ||
        res.address.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const stats = {
    total: reservations.length,
    neu: reservations.filter(r => r.status === 'Neu').length,
    bestaetigt: reservations.filter(r => r.status === 'Bestätigt').length,
    abgeschlossen: reservations.filter(r => r.status === 'Abgeschlossen').length,
  };

  if (!loggedIn) {
    return (
      <div className={styles.loginWrapper}>
        <div className={`glass-card ${styles.loginCard} animate-fade-in-up`}>
          <h1 className={styles.loginTitle}>Admin Login</h1>
          {loginError && <div className="badge badge-error" style={{ marginBottom: '1rem', width: '100%', justifyContent: 'center' }}>{loginError}</div>}
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <div>
              <label className="form-label">Benutzername</label>
              <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">Passwort</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Einloggen</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.dashboardWrapper}`}>
      <div className={styles.dashboardHeader}>
        <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Gesamt</span>
          <span className={styles.statNumber}>{stats.total}</span>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Neu</span>
          <span className={styles.statNumber} style={{ color: 'var(--status-pending)' }}>{stats.neu}</span>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Bestätigt</span>
          <span className={styles.statNumber} style={{ color: 'var(--status-success)' }}>{stats.bestaetigt}</span>
        </div>
        <div className={`glass-card ${styles.statCard}`}>
          <span className={styles.statLabel}>Abgeschlossen</span>
          <span className={styles.statNumber} style={{ color: 'var(--text-secondary)' }}>{stats.abgeschlossen}</span>
        </div>
      </div>

      <div className={styles.filterBar}>
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '200px' }}>
          <option value="Alle">Alle Status</option>
          <option value="Neu">Neu</option>
          <option value="Bestätigt">Bestätigt</option>
          <option value="Abgeschlossen">Abgeschlossen</option>
          <option value="Storniert">Storniert</option>
        </select>
        
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            className={`form-input ${styles.searchInput}`} 
            placeholder="Suchen nach Name, Service..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.th}>Datum</th>
              <th className={styles.th}>Zeit & Ort</th>
              <th className={styles.th}>Kunde</th>
              <th className={styles.th}>Service</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Lade Daten...</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Keine Reservierungen gefunden.</td></tr>
            ) : (
              filteredData.map(res => (
                <tr key={res.id} className={styles.tr}>
                  <td className={styles.td} data-label="Datum">
                    <strong>{res.date}</strong><br/>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Eingang: {new Date(res.createdAt).toLocaleDateString('de-AT')}
                    </span>
                  </td>
                  <td className={styles.td} data-label="Zeit & Ort">
                    {res.timePreference}<br/>
                    <span style={{ color: 'var(--accent-primary)', fontSize: '0.85em' }}>{res.location}</span>
                  </td>
                  <td className={styles.td} data-label="Kunde">
                    <strong>{res.name}</strong><br/>
                    <a href={`mailto:${res.email}`} style={{ color: 'var(--text-secondary)' }}>{res.email}</a><br/>
                    <a href={`tel:${res.phone}`} style={{ color: 'var(--text-secondary)' }}>{res.phone}</a>
                  </td>
                  <td className={styles.td} data-label="Service">
                    <strong>{res.service}</strong><br/>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85em', display: 'block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {res.address}
                    </span>
                    {res.message && <div style={{ fontSize: '11px', marginTop: '4px', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{res.message}"</div>}
                  </td>
                  <td className={styles.td} data-label="Status">
                    <span className={`badge ${getBadgeClass(res.status)}`}>{res.status}</span>
                  </td>
                  <td className={styles.td} data-label="Aktionen">
                    <div className={styles.actionCell}>
                      {res.status === 'Neu' && (
                        <>
                          <button className={styles.actionBtnConfirm} onClick={() => updateStatus(res.id, 'Bestätigt')} title="Bestätigen"><CheckCircle size={14}/></button>
                          <button className={styles.actionBtnCancel} onClick={() => updateStatus(res.id, 'Storniert')} title="Stornieren"><XCircle size={14}/></button>
                        </>
                      )}
                      {res.status === 'Bestätigt' && (
                        <>
                          <button className={styles.actionBtnComplete} onClick={() => updateStatus(res.id, 'Abgeschlossen')} title="Abschließen"><CheckCircle size={14}/></button>
                          <button className={styles.actionBtnCancel} onClick={() => updateStatus(res.id, 'Storniert')} title="Stornieren"><XCircle size={14}/></button>
                        </>
                      )}
                      {(res.status === 'Abgeschlossen' || res.status === 'Storniert') && (
                        <span style={{ color: 'var(--border-medium)', fontWeight: 'bold' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
