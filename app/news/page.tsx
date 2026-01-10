'use client';

import React from 'react';
import styles from './page.module.css';

type Article = {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
};

const PLACEHOLDER = '/logo_berita.png';

const ARTICLES: Article[] = [
{ id: 'a1', title: 'Google Gemini App luncurkan fitur deteksi gambar AI dengan watermark SynthID', source: 'Blockchain.News', date: 'November 20, 2025', url: 'https://blockchain.news/ainews/google-geminiapp-launches-ai-generated-image-detection-feature-using-synthid-watermark' },
{ id: 'a2', title: 'Uni Emirat Arab peringatkan penggunaan AI untuk menggambarkan tokoh publik dan simbol tanpa izin', source: 'The National News', date: 'September 25, 2025', url: 'https://www.thenationalnews.com/news/uae/2025/09/25/uae-warns-against-use-of-ai-to-depict-public-figures-for-online-misinformation/' },
{ id: 'a3', title: 'Tren gambar Polaroid AI viral di media sosial', source: 'RRI.co.id', date: 'Oktober 2025', url: 'https://rri.co.id/lain-lain/1833416/fenomena-tren-foto-polaroid-ai' },
{ id: 'a4', title: 'Nano Banana: revolusi pengeditan gambar berbasis AI oleh Google DeepMind', source: 'Times Indonesia', date: 'September 5, 2025', url: 'https://timesindonesia.co.id/tekno/553266/nano-banana-revolusi-edit-gambar-di-era-ai' },
{ id: 'a5', title: 'Foto hasil AI penangkapan Presiden Maduro banjiri medsos dan sulit dibedakan dari nyata', source: 'CNN Indonesia', date: 'January 7, 2026', url: 'https://www.cnnindonesia.com/teknologi/20260107141425-185-1314498/foto-ai-penangkapan-presiden-maduro-banjiri-medsos-simak-bedanya' },
];



export default function NewsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Berita Terkini: Gambar AI</h1>
      <ul className={styles.list}>
        {ARTICLES.map((a) => (
          <li key={a.id} className={styles.card}>
            <a href={a.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              <div className={styles.thumbWrapper}>
                <img src={PLACEHOLDER} alt="Placeholder Berita" className={styles.thumb} />
              </div>
              <div className={styles.body}>
                <h2 className={styles.title}>{a.title}</h2>
                <p className={styles.meta}>
                  <span>{a.source}</span> &bull; <span>{a.date}</span>
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
