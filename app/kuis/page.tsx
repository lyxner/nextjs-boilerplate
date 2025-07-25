"use client";

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

type Question = {
  id: number;
  imageReal: string;
  imageAI: string;
};

// Generate 10 questions; correct answer always "real"
const easyQuestions: Question[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    imageReal: `/images/kuis/real${n}.webp`,
    imageAI: `/images/kuis/ai${n}.webp`,
  };
});

export default function KuisEasy() {
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
    return (
      <p className={`${styles.feedback} ${
        a === 'real' ? styles.correctText : styles.wrongText
      }`}>
        {a === 'real'
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
        <h1>Kuis Interaktif (Mudah)</h1>
        <label htmlFor="difficulty-select" className={styles.selectorLabel}>
          Tingkat Kesulitan:
        </label>
        <select
          id="difficulty-select"
          aria-label="Pilih tingkat kesulitan"
          className={styles.selector}
          defaultValue="easy"
          onChange={e => {
            if (e.currentTarget.value === 'hard') {
              window.location.href = '/kuis/hard';
            }
          }}
        >
          <option value="easy">Mudah</option>
          <option value="hard">Susah</option>
        </select>
      </div>

      <p>
        Di bawah ini terdapat {easyQuestions.length} pertanyaan. Pilih gambar yang{' '}
        <strong>asli</strong> (real).
      </p>

      {easyQuestions.map(q => {
        // urutan opsi silih berganti: ganjil: AI dulu, real belakangan; genap: real dulu, AI belakangan
        const options: ('real' | 'ai')[] =
          q.id % 2 === 1 ? ['ai', 'real'] : ['real', 'ai'];

        return (
          <div key={q.id} className={styles.questionCard}>
            <p className={styles.questionTitle}>Pertanyaan {q.id}</p>
            <div className={styles.options}>
              {options.map(val => {
                const isAi = val === 'ai';
                const isSelected = answers[q.id] === val;
                let cls = '';
                if (disabled[q.id]) {
                  if (val === 'real') cls = styles.correct;
                  else if (isSelected) cls = styles.wrong;
                }
                return (
                  <label key={val} className={`${styles.optionCard} ${cls}`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      aria-label={isAi ? 'Pilihan Gambar AI' : 'Pilihan Gambar Asli'}
                      disabled={disabled[q.id]}
                      checked={isSelected}
                      onChange={() => handleAnswer(q, val)}
                    />
                    <div className={styles.imageWrapper}>
                      <img
                        src={isAi ? q.imageAI : q.imageReal}
                        alt={isAi ? 'Gambar AI' : 'Gambar Asli'}
                        loading="lazy"
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
