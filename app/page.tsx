// app/page.tsx
'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  // Data card dashboard. Anda bisa menyesuaikan title, description, dan route.
  const cards = [
   {
      title: 'Cara Mengenali Gambar AI',
      description: 'Panduan mengenali ciri-ciri gambar yang dihasilkan AI.',
      href: '/cara',
      imgSrc: 'https://via.placeholder.com/300x200?text=Cara+Mengenali+AI',
      imgAlt: 'Cara Mengenali Gambar AI',
    },
    {
      title: 'Model & Tools',
      description: 'Pelajari berbagai model dan alat untuk generative AI.',
      href: '/modell',
      imgSrc: 'https://via.placeholder.com/300x200?text=Model+%26+Tools',
      imgAlt: 'Model & Tools',
    },
      {
      title: 'Kuis Interaktif',
      description: 'Tes kemampuan Anda membedakan gambar asli vs AI.',
      href: '/kuis',
      imgSrc: 'https://via.placeholder.com/300x200?text=Kuis',
      imgAlt: 'Kuis Interaktif',
    },
    {
      title: 'Kuis Interaktif',
      description: 'Tes kemampuan Anda dalam menyamakan promt yang sesuai dengan gambar .',
      href: '/match-promt',
      imgSrc: 'https://via.placeholder.com/300x200?text=Kuis',
      imgAlt: 'Kuis Match Prompt',
    },
     {
      title: 'Generate Gambar AI',
      description: 'Masukkan prompt anda dan buat gambar AI anda.',
      href: '/generate',
      imgSrc: 'https://via.placeholder.com/300x200?text=Model+%26+Tools',
      imgAlt: 'Model & Tools',
    },
     {
      title: 'Deteksi Gambar AI',
      description: 'Unggah gambar untuk mendeteksi apakah dihasilkan oleh AI.',
      href: '/deteksi',
      // placeholder image: Anda bisa ganti nanti sesuai aset
      imgSrc: 'https://via.placeholder.com/300x200?text=Deteksi+AI',
      imgAlt: 'Deteksi AI',
    },
     {
      title: 'Berita',
      description: 'Melihat berita seputar Gambar AI ',
      href: '/news',
      // placeholder image: Anda bisa ganti nanti sesuai aset
      imgSrc: 'https://via.placeholder.com/300x200?text=Deteksi+AI',
      imgAlt: 'News',
    },
    // Tambahkan item lain jika perlu
  ];

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.subheading}>
        Selamat datang! Pilih halaman yang ingin Anda akses:
      </p>
      <div className={styles.grid}>
        {cards.map((card) => (
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
