'use client';

import { useState } from 'react';
import Script from 'next/script';
import styles from './page.module.css';

type Thread = {
  id: string;
  image: string;
  caption: string;
};

const STATIC_THREADS: Thread[] = [
  {
    id: 'thread-1',
    image: '/images/example-ai.png',     // letakkan placeholder di public/images
    caption: 'Contoh Gambar AI: sebuah lanskap futuristik.',
  },
  {
    id: 'thread-2',
    image: '/images/example-real.jpg',
    caption: 'Contoh Gambar Asli: pemandangan pegunungan sore hari.',
  },
];

export default function DiscussionPage() {
  const [threads] = useState<Thread[]>(STATIC_THREADS);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Forum Diskusi Kasus AI</h1>

      {threads.map(thread => (
        <article key={thread.id} className={styles.threadCard} id={thread.id}>
          <img
            src={thread.image}
            alt={thread.caption}
            className={styles.threadImage}
          />
          <p className={styles.threadCaption}>{thread.caption}</p>

          {/* Disqus thread untuk tiap post */}
          <div id={`disqus_thread_${thread.id}`} className={styles.disqus}></div>
          <Script
            id={`disqus-script-${thread.id}`}
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                var disqus_config = function () {
                  this.page.url = window.location.origin + '/discussion#${thread.id}';
                  this.page.identifier = '${thread.id}';
                };
                (function() {
                  var d = document, s = d.createElement('script');
                  s.src = 'https://${process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}.disqus.com/embed.js';
                  s.setAttribute('data-timestamp', +new Date());
                  document.getElementById('disqus_thread_${thread.id}').appendChild(s);
                })();
              `,
            }}
          />
        </article>
      ))}

      <Script
        id="disqus-count"
        strategy="lazyOnload"
        src={`https://${process.env.NEXT_PUBLIC_DISQUS_SHORTNAME}.disqus.com/count.js`}
      />
    </main>
  );
}
