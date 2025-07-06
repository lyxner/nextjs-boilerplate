"use client";

import Link from 'next/link';
import { useState } from 'react';
// gunakan CSS module dari folder kuis (level satu)
import styles from '../page.module.css';

type Question = {
  id: number;
  imageReal: string;
  imageAI: string;
};

// Generate 10 soal (tingkat susah); jawaban selalu "real"
const hardQuestions: Question[] = Array.from({ length: 5 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    imageReal: `/images2/kuis/real${n}.webp`,
    imageAI: `/images2/kuis/ai${n}.webp`,
  };
});

export default function KuisHard() {
  const [answers, setAnswers] = useState<Record<number, 'real' | 'ai'>>({});
  const [disabled, setDisabled] = useState<Record<number, boolean>>({});

  const handleAnswer = (q: Question, val: 'real' | 'ai') => {
    if (disabled[q.id]) return;
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    setDisabled(prev => ({ ...prev, [q.id]: true }));
  };

  const getFeedback = (q: Question) => {
    const a = answers[q.id];
    if (!a) return null;
    const isCorrect = a === 'real';
    return (
      <p className={`${styles.feedback} ${
        isCorrect ? styles.correctText : styles.wrongText
      }`}>
        {isCorrect
          ? 'Benar! Anda memilih gambar asli.'
          : 'Jawaban Anda salah.'}
      </p>
    );
  };

  const resetQuiz = () => {
    setAnswers({});
    setDisabled({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Kuis Interaktif (Susah)</h1>
        <label htmlFor="difficulty-select" className={styles.selectorLabel}>
          Tingkat Kesulitan:
        </label>
        <select
          id="difficulty-select"
          aria-label="Pilih tingkat kesulitan"
          className={styles.selector}
          defaultValue="hard"
          onChange={e => {
            if (e.currentTarget.value === 'easy') {
              window.location.href = '/kuis';
            }
          }}
        >
          <option value="easy">Mudah</option>
          <option value="hard">Susah</option>
        </select>
      </div>

      <p>
        Di bawah ini terdapat {hardQuestions.length} pertanyaan. Pilih gambar yang{' '}
        <strong>asli</strong> (real).
      </p>

      {hardQuestions.map(q => {
        // opsi selang-seling: ganjil ['ai','real'], genap ['real','ai']
        const options: ('real' | 'ai')[] = q.id % 2 === 1 ? ['ai', 'real'] : ['real', 'ai'];

        return (
          <div key={q.id} className={styles.questionCard}>
            <p className={styles.questionTitle}>Pertanyaan {q.id}</p>
            <div className={styles.options}>
              {options.map(val => {
                const isReal = val === 'real';
                const isSelected = answers[q.id] === val;
                let cls = '';
                if (disabled[q.id]) {
                  if (isReal) cls = styles.correct;
                  else if (isSelected) cls = styles.wrong;
                }
                return (
                  <label key={val} className={`${styles.optionCard} ${cls}`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      aria-label={isReal ? 'Pilihan Gambar Asli' : 'Pilihan Gambar AI'}
                      disabled={disabled[q.id]}
                      checked={isSelected}
                      onChange={() => handleAnswer(q, val)}
                    />
                    <div className={styles.imageWrapper}>
                      <img
                        src={isReal ? q.imageReal : q.imageAI}
                        alt={isReal ? 'Gambar Asli' : 'Gambar AI'}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
            {getFeedback(q)}
          </div>
        );
      })}

      <button className={styles.resetButton} onClick={resetQuiz}>
        Ulangi Kuis
      </button>
    </div>
  );
}
