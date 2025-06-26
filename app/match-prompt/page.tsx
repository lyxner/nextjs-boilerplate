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

// Contoh data 10 soal dengan prompt nyata
const QUESTIONS: Question[] = [
  {
    id: 1,
    image: '/images/match/ai1.png',
    promptA: 'Seorang gadis muda duduk di bangku kayu di taman saat musim semi, dikelilingi oleh pohon sakura berbunga merah muda, mengenakan gaun putih dan topi jerami, sinar matahari menembus dedaunan, warna-warna pastel yang lembut, gaya anime.',
    promptB: 'Seorang gadis muda duduk di bangku kayu di taman saat musim gugur, dikelilingi oleh daun maple berwarna oranye yang berguguran, mengenakan mantel merah gelap dan sepatu bot hitam, langit mendung, suasana tenang dan sedikit muram, gaya anime.',
    correct: 'A',
  },
  {
    id: 2,
    image: '/images/match/ai2.png',
    promptA: 'Pemandangan kota futuristik di malam hari dengan gedung-gedung tinggi bercahaya neón, jalanan basah memantulkan lampu kendaraan, mobil terbang melintas, atmosfer cyberpunk, gaya sinematik.',
    promptB: 'Pemandangan desa pedesaan di pagi hari dengan kabut tipis, ladang hijau luas, sapi merumput, cahaya matahari lembut, suasana damai, gaya realistik.',
    correct: 'A',
  },
  {
    id: 3,
    image: '/images/match/ai3.png',
    promptA: 'Seekor kucing hitam dengan mata hijau menyala duduk di atas papan kayu di atap rumah tua, latar belakang bulan purnama besar dan awan bergerak, nuansa misterius, gaya gothic.',
    promptB: 'Seekor anjing golden retriever bermain di pantai saat matahari terbenam, ombak lembut, langit oranye-merah, terasa hangat, gaya fotograﬁ alami.',
    correct: 'A',
  },
  {
    id: 4,
    image: '/images/match/ai4.png',
    promptA: 'Seorang kesatria berzirah perak berdiri di medan perang berdebu, pedang menyala dengan cahaya biru, gunung vulkanik di latar belakang, suasana epik, gaya fantasi.',
    promptB: 'Seorang perenang membawa papan selancar di pantai tropis, air jernih, pohon kelapa, langit biru cerah, gaya dokumenter alam.',
    correct: 'A',
  },
  {
    id: 5,
    image: '/images/match/ai5.png',
    promptA: 'Ruang angkasa dengan galaksi spiral besar, bintang-bintang berwarna-warni, pesawat luar angkasa kecil melintas di kejauhan, nuansa kosmik, gaya ilustrasi sci‑fi.',
    promptB: 'Interior kafe klasik di Paris dengan lampu gantung kuning hangat, meja-marmer dan kursi besi, suasana hangat, gaya lukisan minyak.',
    correct: 'A',
  },
  {
    id: 6,
    image: '/images/match/ai6.png',
    promptA: 'Sekelompok penari tradisional Bali mengenakan kostum warna-warni, gerakan terpadu di atas panggung, latar belakang pura, gaya seni budaya.',
    promptB: 'Sekelompok astronot berjalan di kawah bulan, permukaan berdebu, Bumi terlihat di langit, nuansa sunyi, gaya hyper‑realistic.',
    correct: 'A',
  },
  {
    id: 7,
    image: '/images/match/ai7.png',
    promptA: 'Meja kayu di studio seniman dipenuhi cat tumpah, kuas, kanvas setengah jadi dengan sketsa bunga mawar, cahaya alami masuk lewat jendela besar, gaya artisanal.',
    promptB: 'Rak buku antik di perpustakaan tua, debu halus, sinar matahari melewati jendela kaca patri, suasana sunyi, gaya dramatis.',
    correct: 'A',
  },
  {
    id: 8,
    image: '/images/match/ai8.png',
    promptA: 'Lamborghini futuristik berwarna chrome mengkilap diparkir di depan gedung pencakar langit kaca, jalan basah memantulkan cahaya lampu kota malam, gaya ultra‑modern.',
    promptB: 'Sebuah perahu dayung di danau pegunungan, air tenang memantulkan puncak bersalju, kabut tipis, gaya lanskap romantik.',
    correct: 'A',
  },
  {
    id: 9,
    image: '/images/match/ai9.png',
    promptA: 'Kamar tidur minimalis dengan dinding putih, tanaman Monstera di sudut, sinar matahari lembut masuk, nuansa hygge, gaya interior modern.',
    promptB: 'Pesta karnaval di Rio de Janeiro, penari mengenakan kostum penuh bulu dan payet, kerumunan bahagia, warna cerah, gaya festif.',
    correct: 'A',
  },
  {
    id: 10,
    image: '/images/match/ai10.png',
    promptA: 'Jembatan suspensi ikonik di bawah kabut pagi, berjalan kaki sendirian, pemandangan kota samar di kejauhan, suasana misterius, gaya fotografi hitam-putih.',
    promptB: 'Lapangan bunga matahari luas di musim panas, langit biru cerah, anak-anak berlari, suasana ceria, gaya realistik.',
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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Game: Cocokkan Prompt</h1>
      <p className={styles.description}>
        Untuk setiap gambar AI, pilih prompt (A atau B) yang **benar** digunakan untuk membuatnya.
      </p>

      {QUESTIONS.map(q => {
        const ans = answers[q.id];
        const isCorrect = ans === q.correct;
        return (
          <div key={q.id} className={styles.card}>
            <img src={q.image} alt={`Gambar AI ${q.id}`} className={styles.image} />
            <div className={styles.options}>
              {(['A','B'] as const).map(label => {
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

      <button
        className={styles.reset}
        onClick={() => {
          setAnswers({});
          setDisabled({});
        }}
      >
        Main Lagi
      </button>
    </div>
  );
}
