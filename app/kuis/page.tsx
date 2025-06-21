'use client';
import { useState } from 'react';

type Question = {
  id: number;
  correct: 'real' | 'ai';
  imageReal: string;
  imageAI: string;
};

const questions: Question[] = Array.from({ length: 10 }, (_, i) => {
  const number = i + 1;
  return {
    id: number,
    correct: number % 2 === 0 ? 'ai' : 'real', // contoh pola
    imageReal: `https://via.placeholder.com/150x150?text=Asli+${number}`,
    imageAI: `https://via.placeholder.com/150x150?text=AI+${number}`,
  };
});

export default function KuisPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [disabled, setDisabled] = useState<Record<number, boolean>>({});

  const handleAnswer = (q: Question, answer: string) => {
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
      return <p className="feedback" style={{ color: 'green' }}>Benar!</p>;
    }
    return (
      <p className="feedback" style={{ color: 'red' }}>
        Salah! Jawaban yang benar adalah gambar {q.correct === 'real' ? 'asli.' : 'AI.'}
      </p>
    );
  };

  return (
    <div className="container">
      <h1>Kuis Interaktif</h1>
      <p>Di bawah ini terdapat 10 pertanyaan. Pilih gambar yang <strong>asli</strong>.</p>

      {questions.map((q) => (
        <div key={q.id} className="question" data-correct={q.correct}>
          <p>Pertanyaan {q.id}: Manakah gambar yang asli?</p>
          <div className="options">
            <label>
              <input
                type="radio"
                name={`q${q.id}`}
                value="ai"
                disabled={disabled[q.id]}
                onChange={() => handleAnswer(q, 'ai')}
              />
              <img src={q.imageAI} alt="Gambar AI" />
            </label>
            <label>
              <input
                type="radio"
                name={`q${q.id}`}
                value="real"
                disabled={disabled[q.id]}
                onChange={() => handleAnswer(q, 'real')}
              />
              <img src={q.imageReal} alt="Gambar Asli" />
            </label>
          </div>
          {getFeedback(q)}
        </div>
        
      ))}
      <button onClick={() => {
  setAnswers({});
  setDisabled({});
}} style={{ marginTop: '2rem' }}>
  Ulangi Kuis
</button>
    </div>
  );
}
