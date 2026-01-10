// app/cara/page.tsx
import styles from './page.module.css';

const karakteristik = [
  'Kesalahan Anatomi Tubuh',
  'Artefak Gaya',
  'Ketidaksesuaian Fungsional ',
  'Pelanggaran Hukum Fisika',
  'kesalahan sosial kultural' 
  ,
 
];

const penjelasanKarakteristik: string[] = [
  'Kelainan pada bentuk anatomi tubuh seperti jari tangan yang hilang/kelebihan/menyatu, mata dengan bentuk pupil yang tidak natural /mata terlalu mengkilap, gigi yang susunannya aneh atau menyatu dengan bibir, tubuh dengan anggota ekstra/hilang atau proporsi yang tidak natural, bagian tubuh yang menyatu antar orang atau objek, serta karakteristik fisik yang tidak konsisten kalau dibandingkan dengan foto asli.',
  'Masalah pada estetika dan tekstur gambar seperti kulit atau permukaan yang tampak plastik/lilin/terlalu mengkilap, gaya yang jadi berlebihan sinematik, detail yang terlalu berlebihan di bagian tertentu yang terasa tidak natural, dan inkonsistensi resolusi atau warna antar bagian gambar.',
  'Kesalahan karena AI nggak paham dunia nyata seperti hubungan antar objek/orang yang tidak logis, objek yang jadi rusak/tak bisa dipakai, detail halus yang ikut terdistorsi, teks atau logo yang tidak terbaca, serta elemen berlebihan atau keluar konteks yang muncul gara-gara prompt.',
  'kesalahan yang melanggar hukum fisika di dunia nyata seperti bayangan dengan arah atau bentuk yang nggak konsisten, pantulan atau refleksi yang nggak cocok sama adegan, serta masalah kedalaman/perspektif seperti distorsi pada objek.',
  'kesalahan karena AI nggak paham konteks sosial/budaya seperti adegan yang mungkin tapi sangat nggak biasa atau jelas fiksi, situasi yang nggak pantas karena gabungan elemen yang bertentangan, detail budaya yang keliru atau disalahartikan, serta representasi sejarah yang tidak masuk akal.',
];

// Gallery untuk setiap karakteristik
const placeholdersPerList: string[][] = [
  [
    '/slide/kucing1.webp',
    '/slide/panda1.webp',
     '/slide/harimau1.webp',
      '/slide/elang1.webp',
       '/slide/jerapah1.webp',
        '/slide/orang.webp',
        '/slide/tangan1.webp',
       
    
  ],
  [
    '/slide2/orang1.webp',
    '/slide2/orang2.webp',
    '/slide2/orang3.webp',
    '/slide2/orang4.webp',
    '/slide2/orang5.webp',
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