"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Q = { id: number; imageReal: string; imageAI: string };

const easyQuestions: Q[] = Array.from({ length: 10 }, (_, i) => {
  const n = i + 1;
  return { id: n, imageReal: `/images/kuis/real${n}.webp`, imageAI: `/images/kuis/ai${n}.webp` };
});

export default function KuisEasy() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, "real" | "ai">>({});

  const choose = (id: number, val: "real" | "ai") => {
    if (answers[id]) return;
    setAnswers(s => ({ ...s, [id]: val }));
  };

  const reset = () => {
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Kuis Interaktif (Mudah)</h1>
        <label htmlFor="difficulty-select" className={styles.selectorLabel}>Tingkat Kesulitan:</label>
        <select
          id="difficulty-select"
          aria-label="Pilih tingkat kesulitan"
          className={styles.selector}
          defaultValue="easy"
          onChange={(e) => e.currentTarget.value === "hard" && router.push("/kuis/hard")}
        >
          <option value="easy">Mudah</option>
          <option value="hard">Susah</option>
        </select>
      </div>

      <p>Di bawah ini terdapat {easyQuestions.length} pertanyaan. Pilih gambar yang <strong>asli</strong> (real).</p>

      {easyQuestions.map((q) => {
        const options = q.id % 2 === 1 ? (["ai", "real"] as const) : (["real", "ai"] as const);
        return (
          <div key={q.id} className={styles.questionCard}>
            <p className={styles.questionTitle}>Pertanyaan {q.id}</p>
            <div className={styles.options}>
              {options.map((val) => {
                const isSelected = answers[q.id] === val;
                const disabled = !!answers[q.id];
                const cls =
                  disabled && (val === "real" ? styles.correct : isSelected ? styles.wrong : "");
                return (
                  <label key={val} className={`${styles.optionCard} ${cls}`}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      aria-label={val === "ai" ? "Pilihan Gambar AI" : "Pilihan Gambar Asli"}
                      disabled={disabled}
                      checked={isSelected}
                      onChange={() => choose(q.id, val)}
                    />
                    <div className={styles.imageWrapper}>
                      <img
                        src={val === "ai" ? q.imageAI : q.imageReal}
                        alt={val === "ai" ? "Gambar AI" : "Gambar Asli"}
                        loading="lazy"
                      />
                    </div>
                  </label>
                );
              })}
            </div>

            {answers[q.id] && (
              <p className={`${styles.feedback} ${
                answers[q.id] === "real" ? styles.correctText : styles.wrongText
              }`}>
                {answers[q.id] === "real" ? "Benar! Anda memilih gambar asli." : "Jawaban Anda salah."}
              </p>
            )}
          </div>
        );
      })}

      <button className={styles.resetButton} onClick={reset}>Ulangi Kuis</button>
    </div>
  );
}
