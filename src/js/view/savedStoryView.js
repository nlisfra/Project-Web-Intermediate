import { getAllLocalStories } from '../model/indexedDB.js';

const savedStoryView = {
  render(stories, container) {
    container.innerHTML = '';

    stories.forEach((story, index) => {
      const storyEl = document.createElement('li');
      storyEl.classList.add('story-card');

      const createdDate = story.createdAt
        ? new Date(story.createdAt).toLocaleDateString("id-ID")
        : "Tanggal tidak tersedia";

      const osmLink =
        story.lat != null && story.lon != null
          ? `https://www.openstreetmap.org/?mlat=${story.lat}&mlon=${story.lon}#map=15/${story.lat}/${story.lon}`
          : "#";

      storyEl.innerHTML = `
        <div class="story-container" style="position: relative;">
          <h3>${story.name || "Tanpa Nama"}</h3>
          <p class="story-date">🕒 Dibuat pada: ${createdDate}</p>
          <div class="story-flex">
            <div class="story-left">
              ${story.photoUrl || story.imageBlob ? `
                <img 
                  src="${story.photoUrl || URL.createObjectURL(story.imageBlob)}" 
                  alt="Foto cerita dari ${story.name || "pengguna"}" 
                  class="story-photo" 
                  style="max-width: 300px; border-radius: 8px;"
                />
              ` : `<p><em>Gambar tidak tersedia.</em></p>`}
              <p><em>"${story.description || ""}"</em></p>
            </div>
            <div class="story-right">
              <div id="saved-map-${index}" class="map-box" style="height: 250px; border-radius: 8px;"></div>
              ${story.lat != null && story.lon != null
                ? `<p><a href="${osmLink}" target="_blank" rel="noopener">📍 Lihat lokasi di OpenStreetMap</a></p>`
                : `<p><em>Lokasi tidak tersedia</em></p>`}
            </div>
          </div>
          <button class="remove-btn" data-id="${story.id}">Hapus</button>
        </div>
      `;

      container.appendChild(storyEl);
    });

    stories.forEach((story, index) => {
      if (story.lat != null && story.lon != null) {
        setTimeout(() => {
          const mapId = `saved-map-${index}`;
          const mapElement = L.DomUtil.get(mapId);
          if (mapElement) {
            mapElement._leaflet_id = null;

            const map = L.map(mapId).setView([story.lat, story.lon], 13);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            }).addTo(map);

            const marker = L.marker([story.lat, story.lon]).addTo(map);
            marker.bindPopup(`<strong>${story.name || "Pengguna"}</strong><br>${story.description || ""}`);
            
            map.scrollWheelZoom.disable();
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
          }
        }, 100);
      }
    });

    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (id && this.onRemove) {
          this.onRemove(id);
        }
      });
    });
  },

  renderError(message, container) {
    container.innerHTML = `<p class="error">${message}</p>`;
  },

  bindRemoveHandler(handler) {
    this.onRemove = handler;
  }
};

export default savedStoryView;