---
layout: default
title: Beranda - Physics Digital Learning
---

<div class="hero-section">
  <h1>Selamat Datang di Physics Digital Learning!</h1>
  <p class="lead-text">Platform interaktif untuk mengeksplorasi konsep Fisika melalui simulasi, visualisasi, dan papan tulis digital.</p>
  
  <div class="hero-buttons">
    <a href="{{ site.baseurl }}/topics/sejarah-perkembangan-ilmu-fisika.html" class="btn btn-primary">Mulai Belajar</a>
    <a href="{{ site.baseurl }}/topics/whiteboard.html" class="btn btn-outline">Buka Whiteboard</a>
  </div>
</div>

<div class="features-grid">
  <div class="feature-card">
    <div class="icon">🚀</div>
    <h3>Simulasi Interaktif</h3>
    <p>Visualisasikan teori fisika yang kompleks dengan simulasi berbasis web yang mudah dipahami.</p>
  </div>
  <div class="feature-card">
    <div class="icon">✏️</div>
    <h3>Papan Tulis Digital</h3>
    <p>Gunakan fitur Whiteboard untuk mencoret-coret, menghitung, dan menjelaskan ide secara bebas.</p>
  </div>
  <div class="feature-card">
    <div class="icon">📚</div>
    <h3>Materi Lengkap</h3>
    <p>Dari Kinematika hingga Mekanika Kuantum, temukan topik yang Anda butuhkan di sidebar.</p>
  </div>
</div>

---

## Kontributor Proyek
<p style="text-align: center; color: var(--text-muted);">Terima kasih kepada mereka yang telah berkontribusi dalam pengembangan platform ini:</p>

<div class="contributors-container">
  <div class="contributor-profile">
    <img src="https://github.com/alasyariyphysics.png" alt="Lead Developer">
    <h4>Al-Asy'ari</h4>
    <span>Lead Developer</span>
  </div>
</div>

<style>
/* --- Styling Tombol --- */
.hero-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn {
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
}

.btn-primary {
    background-color: var(--primary-blue);
    color: white !important;
    box-shadow: 0 4px 15px rgba(0, 86, 179, 0.3);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 86, 179, 0.4);
    text-decoration: none;
}

.btn-outline {
    background-color: transparent;
    color: var(--primary-blue) !important;
    border: 2px solid var(--primary-blue);
}

.btn-outline:hover {
    background-color: var(--primary-blue);
    color: white !important;
    text-decoration: none;
}

/* --- Layout Dasar --- */
.hero-section {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(to bottom, #f8f9fa, #ffffff);
    border-radius: 20px;
    margin-bottom: 40px;
}

.lead-text {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 700px;
    margin: 20px auto 0;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 60px;
}

.feature-card {
    background: #fff;
    padding: 40px 30px;
    border-radius: 15px;
    border: 1px solid var(--border-color);
    text-align: center;
    transition: all 0.3s ease;
}

.feature-card:hover {
    border-color: var(--primary-blue);
    transform: translateY(-10px);
}

/* --- Kontributor --- */
.contributors-container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.contributor-profile img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
</style>
