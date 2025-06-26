// app/layout.tsx
import '../styles/globals.css';

export const metadata = {
  title: 'Deteksi Gambar AI',
  description: 'Website edukatif tentang gambar AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {/* Navbar responsif */}
        <nav className="navbar">
          {/* Checkbox toggle untuk hamburger menu */}
          <input type="checkbox" id="nav-toggle" className="nav-toggle" />
          {/* Label sebagai ikon hamburger; klik untuk toggle */}
          <label htmlFor="nav-toggle" className="nav-toggle-label">
            &#9776;
          </label>
          {/* Menu link */}
          <ul className="nav-menu">
            {/* Urutan <li> tetap sama */}
            <li><a href="/">Home</a></li>
            <li><a href="/cara">Gambar AI</a></li>
            <li><a href="/modell">Model & Tools</a></li>
            <li><a href="/kuis">Kuis Interaktif</a></li>
             <li><a href="/generate">Generate Gambar AI</a></li>
            <li><a href="/deteksi">Deteksi AI</a></li>
             <li><a href="/news">Berita</a></li>
          </ul>
        </nav>

        {children}
      </body>
    </html>
  );
}
