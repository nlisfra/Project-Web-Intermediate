import savedStoryView from '../view/savedStoryView.js';
import { getAllSavedStories, removeStory } from '../model/indexedDB.js';

const savedStoryPresenter = {
  async init(container) {
    console.log("Masuk ke halaman Saved Stories");

    if (!container) container = document.getElementById('app');
    container.innerHTML = `
      <h2>📌 Cerita Disimpan</h2>
      <a href="#saved-story-list" class="skip-link">Lewati ke daftar cerita disimpan</a>
      <div id="saved-story-list" tabindex="0"></div>
    `;

    // Tangani klik skip link agar fokus ke daftar cerita
    const skipLink = container.querySelector('.skip-link');
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      document.getElementById('saved-story-list')?.focus();
    });

    // Bind handler hapus cerita di view
    savedStoryView.bindRemoveHandler(async (id) => {
      await removeStory(id);
      await this.init(container); // reload ulang daftar cerita
    });

    try {
      const stories = await getAllSavedStories();
      if (!stories || stories.length === 0) {
        document.getElementById('saved-story-list').innerHTML = '<p><em>Belum ada cerita yang disimpan.</em></p>';
        return;
      }
      savedStoryView.render(stories, document.getElementById('saved-story-list'));
    } catch (error) {
      console.error("Gagal memuat cerita dari IndexedDB:", error);
      savedStoryView.renderError('Terjadi kesalahan saat memuat cerita.', document.getElementById('saved-story-list'));
    }
  }
};

export default savedStoryPresenter;