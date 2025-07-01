// app/layout.tsx
import '../styles/globals.css';

export const metadata = {
  title: 'AIImage',
  description: 'Website edukatif tentang gambar AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav className="navbar">
          <input type="checkbox" id="nav-toggle" className="nav-toggle" />
          <label htmlFor="nav-toggle" className="nav-toggle-label">
            &#9776;
          </label>
          <ul className="nav-menu">
            {/* Logo */}
            <li className="nav-logo">
              <a href="/">AIImage</a>
            </li>
            {/* Link biasa */}
            <li><a href="/cara">Gambar AI</a></li>
            <li><a href="/modell">Model Generatif</a></li>
            <li><a href="/kuis">Kuis Interaktif</a></li>
            <li><a href="/match-prompt">Kuis Match Prompt</a></li>
            <li><a href="/generate">Generate Gambar AI</a></li>
            <li><a href="/deteksi">Deteksi Gambar AI</a></li>
            <li><a href="/news">Berita</a></li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
