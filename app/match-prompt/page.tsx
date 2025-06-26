'use client';

import { useState } from 'react';
import styles from './page.module.css';

type Question = {
  id: number;
  image: string;
  correctPrompt: string;
  wrongPrompt: string;
};

const QUESTIONS: Question[] = Array.from({ length: 10 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    // replace these URLs with your real AI-generated images in public/images/match/
    image: `/images/match/ai${id}.png`,
    correctPrompt: `Prompt benar ${id}`,
    wrongPrompt: `Prompt palsu ${id}`,
  };
});

export default function MatchPromptPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [disabled, setDisabled] = useState<Record<number, boolean>>({});

  const handleSelect = (q: Question, choice: string) => {
    if (disabled[q.id]) return;
    setAnswers(prev => ({ ...prev, [q.id]: choice }));
    setDisabled(prev => ({ ...prev, [q.id]: true }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Game: Cocokkan Prompt</h1>
      <p className={styles.description}>
        Pilih prompt yang benar untuk setiap gambar AI di bawah.
      </p>

      {QUESTIONS.map(q => {
        const ans = answers[q.id];
        const isCorrect = ans === q.correctPrompt;
        return (
          <div key={q.id} className={styles.card}>
            <img src={q.image} alt={`Gambar AI ${q.id}`} className={styles.image} />
            <div className={styles.options}>
              {[q.correctPrompt, q.wrongPrompt]
                .sort() // optional random order: shuffle instead
                .map((text) => {
                  const selected = ans === text;
                  let cls = '';
                  if (disabled[q.id]) {
                    if (text === q.correctPrompt) cls = styles.correct;
                    else if (selected && text !== q.correctPrompt) cls = styles.wrong;
                  }
                  return (
                    <button
                      key={text}
                      className={`${styles.option} ${cls}`}
                      onClick={() => handleSelect(q, text)}
                      disabled={disabled[q.id]}
                      aria-label={`Prompt pilihan: ${text}`}
                    >
                      {text}
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
