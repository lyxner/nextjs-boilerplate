'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  const cards = [
    {
      title: 'Cara Mengenali Gambar AI',
      description: 'Panduan mengenali ciri-ciri gambar yang dihasilkan AI.',
      href: '/cara',
      imgSrc: './home/ai.png',
      imgAlt: 'Cara Mengenali Gambar AI',
    },
    {
      title: 'Model Generatif',
      description: 'Pelajari berbagai model generatif gambar AI.',
      href: '/modell',
      imgSrc: './home/icon1.png',
      imgAlt: 'Model & Tools',
    },
    {
      title: 'Kuis Interaktif',
      description: 'Tes kemampuan Anda membedakan gambar asli vs AI.',
      href: '/kuis',
      imgSrc: './home/quiz.png',
      imgAlt: 'Kuis Interaktif',
    },
    {
      title: 'Kuis Match Prompt',
      description: 'Tes kemampuan Anda dalam menyamakan prompt yang sesuai.',
      href: '/match-prompt',
      imgSrc: './home/answer.png',
      imgAlt: 'Kuis Match Prompt',
    },
    {
      title: 'Generate Gambar AI',
      description: 'Masukkan prompt Anda dan buat gambar AI.',
      href: '/generate',
      imgSrc: './home/generate.png',
      imgAlt: 'Generate Gambar AI',
    },
    {
      title: 'Deteksi Gambar AI',
      description: 'Unggah gambar untuk mendeteksi apakah dihasilkan AI.',
      href: '/deteksi',
      imgSrc: './home/detection.png',
      imgAlt: 'Deteksi Gambar AI',
    },
    {
      title: 'Berita',
      description: 'Lihat berita seputar gambar AI.',
      href: '/news',
      imgSrc: './home/news.png',
      imgAlt: 'News AI',
    },
     {
      title: 'Coming Soon',
      description: 'Coming soon',
      href: '',
      imgSrc: './home/text.png',
      imgAlt: 'News AI',
    },
  ];

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subheading}>
        Selamat datang! Pilih halaman yang ingin Anda akses:
      </p>
      <div className={styles.grid}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={card.imgSrc} alt={card.imgAlt} className={styles.image} />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>{card.title}</h2>
              <p className={styles.cardDesc}>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
