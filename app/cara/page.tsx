// app/cara/page.tsx
import styles from './page.module.css';

const karakteristik = [
  'Detail Tubuh Tidak Wajar',
  'Tekstur Terlalu Halus',
  'Teks atau Logo Aneh',
  'Latar Belakang Aneh',
  'Pencahayaan Sempurna',
];

const penjelasanKarakteristik: string[] = [
  'Beberapa bagian tubuh tampak memanjang, menyusut, atau menempel tidak wajar, misalnya jari yang terlalu panjang, siku tanpa sendi yang jelas, atau mata yang berlainan ukuran.',
  'Permukaan objek tampak sangat mulus dan tanpa cacat—tidak ada pori-pori, goresan, atau noise yang biasa muncul pada foto asli.',
  'Tulisan, simbol, atau logo dalam gambar sering terdistorsi: huruf terbalik, teks terpotong, atau font yang tidak konsisten dengan konteks gambar.',
  'Background menampilkan elemen acak yang tidak masuk akal, seperti benda terapung, bayangan yang salah arah, atau pola yang terulang tanpa alasan.',
  'Cahaya terdistribusi merata di seluruh sudut gambar—jarang ada area bayangan lembut atau sorot lampu yang memberi kesan realistis.',
];

// Gallery untuk setiap karakteristik
const placeholdersPerList: string[][] = [
  [
    '/slide/kucing1.webp',
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
];

type Dampak = { title: string; description: string; image: string };
const dampakMisinformasi: Dampak[] = [
  {
    title: 'Kehilangan Kepercayaan Publik',
    description:
      'Ketika banyak gambar AI palsu beredar, masyarakat menjadi ragu terhadap segala konten visual. Mereka mulai mempertanyakan kebenaran gambar berita, iklan, hingga testimoni produk, sehingga kredibilitas media dan institusi menurun drastis.',
    image: '/slide5/image1.jpg',
  },
  {
    title: 'Penyebaran Opini Keliru',
    description:
      'Gambar yang menyesatkan sering kali digunakan untuk mendukung narasi salah. Misalnya, foto AI yang direkayasa seolah-olah menunjukkan kejadian tertentu dapat memicu rumor dan membuat opini publik terdistorsi, memengaruhi keputusan politik maupun sosial.',
    image: '/slide6/image1.jpg',
  },
  {
    title: 'Kerusakan Reputasi Individu/Brand',
    description:
      'Brand atau individu bisa diserang lewat gambar palsu—misalnya foto yang diubah menunjukkan tindakan negatif. Dampaknya, pelanggan kehilangan kepercayaan, saham turun, dan proses pemulihan reputasi memakan waktu dan biaya besar.',
    image: '/slide6/image1.jpg',
  },
];

function InfiniteSlideshow({ images }: { images: string[] }) {
  const slides = [...images, ...images];
  return (
    <div className={styles.carousel}>
      <div className={styles.slideTrack}>
        {slides.map((url, i) => (
          <div key={i} className={styles.slide}>
            <img src={url} alt={`Slide ${i % images.length + 1}`} loading="lazy" />
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
        Gambar buatan AI memiliki ciri khas yang bisa dikenali jika diperhatikan dengan seksama.
      </p>

      <h2 className={styles.sectionTitle}>Karakteristik Visual Gambar AI</h2>
      <ul className={styles.list}>
        {karakteristik.map((label, idx) => (
          <li key={idx} className={styles.listItem}>
            <strong>{label}:</strong> {penjelasanKarakteristik[idx]}
            <InfiniteSlideshow images={placeholdersPerList[idx]} />
          </li>
        ))}
      </ul>

      <h2 className={styles.sectionTitle}>Dampak Misinformasi Akibat Gambar AI</h2>
      <ul className={styles.list}>
        {dampakMisinformasi.map((dampak, idx) => (
          <li key={idx} className={styles.listItem}>
            <strong>{dampak.title}:</strong>
            <p>{dampak.description}</p>
            <div className={styles.centeredImage}>
              <img src={dampak.image} alt={dampak.title} loading="lazy" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}