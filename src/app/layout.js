import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'Dachdeckerei The Roof | Richard Rohacek - Wien',
  description: 'Ihr Dachdeckermeister in Wien seit über 20 Jahren. Fachbetrieb für Dacheindeckungen, Isolierungen und Kaminsanierung.',
  keywords: ['Dachdeckerei Wien', 'Dachdecker', 'Ziegeldach', 'Flachdach', 'Kaminsanierung', 'Foliendeckung'],
  openGraph: {
    title: 'Dachdeckerei The Roof | Richard Rohacek - Wien',
    description: 'Ihr Dachdeckermeister in Wien seit über 20 Jahren. Fachbetrieb für Dacheindeckungen, Isolierungen und Kaminsanierung.',
    locale: 'de_AT',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
