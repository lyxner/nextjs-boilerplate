// app/cara/page.tsx
import styles from './page.module.css';

const karakteristik = [
  'Kesalahan Anatomi Tubuh',
  'Artefak Gaya',
  'Ketidaksesuaian Fungsional ',
  'Pelanggaran Hukum Fisika',
  'Kesalahan sosial kultural' 
  ,
 
];

const penjelasanKarakteristik: string[] = [
  'Kelainan pada bentuk anatomi tubuh seperti jari tangan yang hilang/kelebihan/menyatu, mata dengan bentuk pupil yang tidak natural /mata terlalu mengkilap, gigi yang susunannya aneh atau menyatu dengan bibir, tubuh dengan anggota ekstra/hilang atau proporsi yang tidak natural, bagian tubuh yang menyatu antar orang atau objek, serta karakteristik fisik yang tidak konsisten kalau dibandingkan dengan foto asli.',
  'Masalah pada estetika dan tekstur gambar seperti kulit atau permukaan yang tampak plastik/tekstur seperti lilin/terlalu mengkilap, gaya visual sinematik yang terlalu berlebihan , detail yang terlalu berlebihan di bagian tertentu yang terasa tidak natural, dan inkonsistensi resolusi atau warna antar bagian gambar.',
  'Kesalahan karena AI tidak paham dunia nyata seperti hubungan antar objek/orang yang tidak logis, objek yang jadi rusak dan tidak jelas bentuknya, detail halus yang ikut terdistorsi, teks yang tidak jelas atau logo yang tidak terbaca, serta elemen berlebihan atau keluar konteks.',
  'Kesalahan yang melanggar hukum fisika di dunia nyata seperti bayangan dengan arah atau bentuk yang nggak konsisten, pantulan atau refleksi yang nggak cocok sama adegan, serta masalah kedalaman/perspektif seperti distorsi pada objek.',
  'Kesalahan karena AI tidak paham konteks sosial/budaya seperti adegan yang mungkin tapi sangat tidak biasa atau jelas fiksi, situasi yang tidak pantas karena gabungan elemen yang bertentangan, detail budaya yang keliru atau disalahartikan, serta representasi sejarah yang tidak masuk akal.',
];

// Galeri untuk setiap karakteristik
const placeholdersPerList: string[][] = [
  [
    '/slide/kucing1.webp',
     '/slide/orang1.png',
      '/slide/elang1.png',
        '/slide/orang.webp',
        '/slide/tangan1.webp',
    
  ],
  [
    '/slide2/orang1.webp',
    '/slide2/orang2.webp',
    '/slide2/orang3.webp',
    '/slide2/orang4.webp',
    '/slide2/kelinci.webp',
  ],
  [
    '/slide3/fungsi1.png',
    '/slide3/fungsi2.png',
    '/slide3/fungsi3.png',
    '/slide3/fungsi4.png',
    '/slide3/fungsi5.png',
  ],
  [
    '/slide4/fisik1.png',
    '/slide4/fisik2.png',
    '/slide4/fisik3.png',
    '/slide4/fisik4.png',
    '/slide4/fisik5.webp',
  ],
  [
    '/slide5/sosial.png',
   '/slide5/sosial2.png',
   '/slide5/sosial3.webp',
   '/slide5/sosial4.webp',
   '/slide5/sosial5.webp',
  ],
 
];

type Dampak = { title: string; description: string; image: string };
const dampakMisinformasi: Dampak[] = [
  {
    title: 'Kehilangan Kepercayaan Publik',
    description:
      'Ketika banyak gambar AI palsu beredar, masyarakat menjadi ragu terhadap segala konten visual. Mereka mulai mempertanyakan kebenaran gambar berita, iklan, hingga testimoni produk, sehingga kredibilitas media dan institusi menurun drastis.',
    image: '/slide6/dampak1.webp',
  },
  {
    title: 'Penyebaran Opini Keliru',
    description:
      'Gambar yang menyesatkan sering kali digunakan untuk mendukung narasi salah. Misalnya, foto AI yang direkayasa seolah-olah menunjukkan kejadian tertentu dapat memicu rumor dan membuat opini publik terdistorsi, memengaruhi keputusan politik maupun sosial.',
    image: '/slide6/dampak2.webp',
  },
  {
    title: 'Kerusakan Reputasi Individu/Brand',
    description:
      'Brand atau individu bisa diserang lewat gambar palsu—misalnya foto yang diubah menunjukkan tindakan negatif. Dampaknya, pelanggan kehilangan kepercayaan, saham turun, dan proses pemulihan reputasi memakan waktu dan biaya besar.',
    image: '/slide6/dampak3.webp',
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