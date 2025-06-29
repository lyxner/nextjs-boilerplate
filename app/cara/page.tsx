// app/cara/page.tsx
import styles from './page.module.css';

const karakteristik = [
  'Detail Tubuh Tidak Wajar',
  'Tekstur Terlalu Halus',
  'Teks atau Logo Aneh',
  'Latar Belakang Aneh',
  'Pencahayaan Sempurna',
  'Watermark Tersembunyi',
];

// Buat array 2D: setiap sub-array berisi 5 path gambar untuk masing-masing list
const placeholdersPerList: string[][] = [
  [
  '/slide2/image1.jpg',
  '/slide2/image1.jpg',
    '/slide2/image1.jpg',
    '/slide2/image1.jpg',
   '/slide2/image1.jpg',
  ],
  [
    '/slide2/image1.jpg',
  '/slide2/image1.jpg',
    '/slide2/image1.jpg',
    '/slide2/image1.jpg',
   '/slide2/image1.jpg',
  ],
  [
    '/slide3/image1.jpg',
     '/slide3/image1.jpg',
      '/slide3/image1.jpg',
       '/slide3/image1.jpg',
        '/slide3/image1.jpg',
   
  ],
  [
 '/slide4/image1.jpg',
    '/slide4/image1.jpg',
     '/slide4/image1.jpg',
      '/slide4/image1.jpg',
       '/slide4/image1.jpg',
  ],
  [
    '/slide3/image1.jpg',
     '/slide3/image1.jpg',
      '/slide3/image1.jpg',
       '/slide3/image1.jpg',
        '/slide3/image1.jpg',

  ],
  [
   '/slide3/image1.jpg',
    '/slide3/image1.jpg',
     '/slide3/image1.jpg',
      '/slide3/image1.jpg',
       '/slide3/image1.jpg',
  ],
];

type InfiniteSlideshowProps = {
  images: string[];
};

function InfiniteSlideshow({ images }: InfiniteSlideshowProps) {
  // duplikat array agar loop seamless
  const slides = [...images, ...images];

  return (
    <div className={styles.carousel}>
      <div className={styles.slideTrack}>
        {slides.map((url, i) => (
          <div key={i} className={styles.slide}>
            <img
              src={url}
              alt={`Slide ${i % images.length + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaraPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cara Mengenali Gambar AI</h1>
      <p className={styles.intro}>
        Gambar AI adalah gambar yang dibuat komputer…
      </p>

      <h2 className={styles.sectionTitle}>Karakteristik Visual Gambar AI</h2>
      <ul className={styles.list}>
        {karakteristik.map((label, idx) => (
          <li key={idx} className={styles.listItem}>
            <strong>{label}:</strong> penjelasan detail…
            {/* Infinite slideshow untuk list ke-idx */}
            <InfiniteSlideshow images={placeholdersPerList[idx]} />
          </li>
        ))}
      </ul>
    </div>
  );
}
