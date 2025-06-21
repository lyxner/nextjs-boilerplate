import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Halaman Utama Saya</title>
        <meta name="description" content="Ini adalah homepage pertama dengan Next.js" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Selamat Datang di Proyek Next.js Kamu 🎉</h1>
        <p style={styles.subtitle}>Halaman ini sudah berhasil kamu ubah!</p>
      </main>
    </>
  );
}

const styles = {
  main: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "#666",
  },
};
