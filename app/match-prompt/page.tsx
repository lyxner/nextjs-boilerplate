'use client';

import { useState } from 'react';
import styles from './page.module.css';

type Question = {
  id: number;
  image: string;
  promptA: string;
  promptB: string;
  correct: 'A' | 'B';
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    image: '/images3/gambar1.webp',
    promptA: 'Interior loteng industri dengan furnitur grafit dan lantai beton halus.',
    promptB: 'Interior loteng industri dengan aksen tembaga hangat dan balok kayu',
    correct: 'A',
  },
  {
    id: 2,
    image: '/images3/gambar2.webp',
    promptA: 'Taman bunga dengan bunga merah muda dan jalur batu berwarna hitam.',
    promptB: 'Taman bunga dengan bunga kuning cerah dan jalur kerikil putih.',
    correct: 'A',
  },
  {
    id: 3,
    image: '/images3/gambar3.webp',
    promptA: 'Sebuah danau kecil yang membeku dengan pegunungan disekitarnya beserta pepohonan.',
    promptB: 'Sebuah danau besar yang membeku dengan pegunungan es disekitarnya beserta pepohonan.',
    correct: 'B',
  },
  {
    id: 4,
    image: '/images3/gambar4.webp',
    promptA: 'Meja makan kayu serta piring porselen motif klasik biru-putih.',
    promptB: 'Meja makan kaca modern dengan piring motif klasik biru-putih.',
    correct: 'A',
  },
  {
    id: 5,
    image: '/images3/gambar5.webp',
    promptA: 'Stasiun metro bawah tanah modern dengan lantai marmer gelap.',
    promptB: 'Stasiun metro bawah tanah modern dengan lantai marmer terang.',
    correct: 'B',
  },
  {
    id: 6,
    image: '/images3/gambar6.webp',
    promptA: 'Lorong gang kota tua dengan lampu gantung kuning dan gerobak kayu.',
    promptB: 'Lorong gang kota tua dengan lampu gantung putih dan gerobak kayu',
    correct: 'A',
  },
  {
    id: 7,
    image: '/images3/gambar7.webp',
    promptA: 'Sudut kota dengan kios makanan jalanan dan lampu neon merah.',
    promptB: 'Sudut kota dengan kios makanan jalanan dan lampu neon biru dan merah.',
    correct: 'A',
  },
  {
    id: 8,
    image: '/images3/gambar8.webp',
    promptA: 'Teh hijau panas dalam cangkir keramik putih dengan dua potong kue di sebelahnya',
    promptB: 'Teh hijau panas dalam cangkir keramik putih dengan sepotong kue di sebelahnya',
    correct: 'B',
  },
  {
    id: 9,
    image: '/images3/gambar9.webp',
    promptA: 'Taman belakang dengan rumput hijau dan bangku kayu tua.',
    promptB: 'Taman belakang dengan rumput hijau dan bangku kayu tua berwarna hitam.',
    correct: 'A',
  },
  {
    id: 10,
    image: '/images3/gambar10.webp',
    promptA: 'Kamar tidur modern dengan dinding berwarna abu-abu dan biru gelap dengan rak buku besar terbuka dan tanaman hijau kecil.',
    promptB: 'Kamar tidur modern dengan dinding berwarna abu-abu dan biru terang dengan rak buku besar terbuka dan tanaman hijau kecil.',
    correct: 'A',
  },
];

export default function MatchPromptPage() {
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [disabled, setDisabled] = useState<Record<number, boolean>>({});

  const handleSelect = (q: Question, choice: 'A' | 'B') => {
    if (disabled[q.id]) return;
    setAnswers(prev => ({ ...prev, [q.id]: choice }));
    setDisabled(prev => ({ ...prev, [q.id]: true }));
  };

  const resetQuiz = () => {
    setAnswers({});
    setDisabled({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Game Kuis: Cocokkan Prompt Gambar AI</h1>
      <p className={styles.description}>
        Untuk setiap gambar AI, pilih prompt (A atau B) yang <strong>benar</strong> digunakan untuk membuatnya.
      </p>

      {QUESTIONS.map(q => {
        const ans = answers[q.id];
        const isCorrect = ans === q.correct;
        return (
          <div key={q.id} className={styles.card}>
            <img src={q.image} alt={`Gambar AI ${q.id}`} className={styles.image} />
            <div className={styles.options}>
              {(['A', 'B'] as const).map(label => {
                const text = label === 'A' ? q.promptA : q.promptB;
                let cls = '';
                if (disabled[q.id]) {
                  if (label === q.correct) cls = styles.correct;
                  else if (ans === label) cls = styles.wrong;
                }
                return (
                  <button
                    key={label}
                    className={`${styles.option} ${cls}`}
                    onClick={() => handleSelect(q, label)}
                    disabled={disabled[q.id]}
                    aria-label={`Prompt ${label}`}
                  >
                    <strong>{label}.</strong> {text}
                  </button>
                );
              })}
            </div>
            {disabled[q.id] && (
              <p className={isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
                {isCorrect ? 'Tepat sekali!' : 'Maaf, itu salah.'}
              </p>
            )}
          </div>
        );
      })}

      <button className={styles.reset} onClick={resetQuiz}>
        Ulangi Kuis
      </button>
    </div>
  );
}
