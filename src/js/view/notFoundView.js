const notFoundView = {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <main id="main-content">
        <h2>🚫 Halaman Tidak Ditemukan</h2>
        <p>Halaman yang kamu cari tidak tersedia.</p>
        <a href="#/login" class="button">⬅️ Kembali ke Login</a>
      </main>
    `;
  }
};

export default notFoundView;