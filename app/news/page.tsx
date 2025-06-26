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
  {
    id: 'a1',
    title: 'Researchers show AI art protection tools still leave creators at risk',
    source: 'UTSA Today',
    date: 'June 23, 2025',
    url: 'https://www.utsa.edu/today/2025/06/story/AI-art-protection-tools-still-leave-creators-at-risk.html'
  },
  {
    id: 'a2',
    title: 'Here’s Why AI-Generated Images Fool You — And How To Spot Them',
    source: 'Civil Beat',
    date: 'June 20, 2025',
    url: 'https://www.civilbeat.org/2025/06/heres-why-ai-generated-images-fool-you-and-how-to-spot-them/'
  },
  {
    id: 'a3',
    title: 'Merging AI and underwater photography to reveal hidden ocean worlds',
    source: 'MIT News',
    date: 'June 25, 2025',
    url: 'https://news.mit.edu/2025/merging-ai-underwater-photography-to-reveal-hidden-ocean-worlds-0625'
  },
  {
    id: 'a4',
    title: 'AI Image Generation Breakthroughs 2025',
    source: 'Medium',
    date: '1 day ago',
    url: 'https://medium.com/ai-simplified-in-plain-english/ai-image-generation-breakthroughs-2025-e81b71e55da1'
  },
  {
    id: 'a5',
    title: 'The 15 biggest announcements at Google I/O 2025 (incl. Imagen 4)',
    source: 'The Verge',
    date: 'May 2025',
    url: 'https://www.theverge.com/news/669408/google-io-2025-biggest-announcements-ai-gemini'
  },
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
