// app/model/page.tsx
export default function ModelPage() {
  return (
    <div className="container">
      <h1>Model dan Tools</h1>

      <h2>Generative Adversarial Networks (GAN)</h2>
      <p>GAN adalah arsitektur AI generatif yang melibatkan dua jaringan...</p>
      <img src="https://via.placeholder.com/300x200?text=Arsitektur+GAN" alt="Arsitektur GAN" />

      <h2>Model Difusi</h2>
      <p>Model difusi bekerja dengan menambahkan noise acak ke gambar...</p>
      <img src="https://via.placeholder.com/300x200?text=Stable+Diffusion" alt="Output Stable Diffusion" />

      <h2>Stable Diffusion</h2>
      <ul>
        <li>Pilih platform Stable Diffusion...</li>
        <li>Masukkan perintah teks...</li>
        <li>Sesuaikan parameter...</li>
        <li>Tekan tombol generate...</li>
      </ul>

      <h2>Midjourney</h2>
      <ul>
        <li>Bergabung ke server Discord Midjourney.</li>
        <li>Ketik <code>/imagine [teks prompt]</code></li>
        <li>Pilih variasi hasil.</li>
      </ul>
    </div>
  );
}
