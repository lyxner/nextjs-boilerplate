'use client';
import { useState } from 'react';

type Question = {
  id: number;
  correct: 'real' | 'ai';
  imageReal: string;
  imageAI: string;
};

// Contoh data: sesuaikan src dan correct sesuai file di public/images/kuis/
const questions: Question[] = Array.from({ length: 10 }, (_, i) => {
  const number = i + 1;
  return {
    id: number,
    // Tentukan manual mana yang benar untuk setiap nomor
    correct: number % 2 === 0 ? 'ai' : 'real',
    imageReal: `/images/kuis/real${number}.jpg`,
    imageAI: `/images/kuis/ai${number}.jpg`,
  };
});

export default function KuisPage() {
  const [answers, setAnswers] = useState<Record<number, 'real' | 'ai'>>({});
  const [disabled, setDisabled] = useState<Record<number, boolean>>({});

  const handleAnswer = (q: Question, answer: 'real' | 'ai') => {
    if (disabled[q.id]) return;
    setAnswers(prev => ({
      ...prev,
      [q.id]: answer,
    }));
    setDisabled(prev => ({
      ...prev,
      [q.id]: true,
    }));
  };

  const getFeedback = (q: Question) => {
    const jawaban = answers[q.id];
    if (!jawaban) return null;
    if (jawaban === q.correct) {
      return <p className="feedback correct-text">Benar!</p>;
    }
    return <p className="feedback wrong-text">Jawaban Anda salah</p>;
  };

  return (
    <div className="container">
      <h1>Kuis Interaktif</h1>
      <p>Di bawah ini terdapat {questions.length} pertanyaan. Pilih gambar yang <strong>asli</strong>.</p>

      {questions.map((q) => {
        const jawaban = answers[q.id];
        const isAnswered = disabled[q.id] === true;
        return (
          <div key={q.id} className="question-card">
            <p className="question-title">Pertanyaan {q.id}: Manakah gambar yang asli?</p>
            <div className="options">
              {/* Pilihan AI */}
              {(() => {
                const value = 'ai' as const;
                const isSelected = jawaban === value;
                let cls = '';
                if (isAnswered) {
                  if (value === q.correct) {
                    cls = 'correct';
                  }
                  if (isSelected && value !== q.correct) {
                    cls = 'wrong';
                  }
                }
                return (
                  <label className={`option-card ${cls}`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={value}
                      disabled={isAnswered}
                      checked={isSelected}
                      onChange={() => handleAnswer(q, value)}
                    />
                    <div className="image-wrapper">
                      <img src={q.imageAI} alt={`Pilihan AI untuk pertanyaan ${q.id}`} />
                    </div>
                  </label>
                );
              })()}
              {/* Pilihan Real */}
              {(() => {
                const value = 'real' as const;
                const isSelected = jawaban === value;
                let cls = '';
                if (isAnswered) {
                  if (value === q.correct) {
                    cls = 'correct';
                  }
                  if (isSelected && value !== q.correct) {
                    cls = 'wrong';
                  }
                }
                return (
                  <label className={`option-card ${cls}`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={value}
                      disabled={isAnswered}
                      checked={isSelected}
                      onChange={() => handleAnswer(q, value)}
                    />
                    <div className="image-wrapper">
                      <img src={q.imageReal} alt={`Pilihan Asli untuk pertanyaan ${q.id}`} />
                    </div>
                  </label>
                );
              })()}
            </div>
            {getFeedback(q)}
          </div>
        );
      })}

      <button
        onClick={() => {
          setAnswers({});
          setDisabled({});
        }}
        className="reset-button"
      >
        Ulangi Kuis
      </button>
    </div>
  );
}
