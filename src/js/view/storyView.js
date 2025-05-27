const storyView = {
  setPresenter(presenter) {
    this.presenter = presenter;
  },

  async render(stories) {
    this.currentStories = stories;

    const container = document.createElement("div");
    container.id = "main-content";
    container.tabIndex = 0;

    const listContainer = document.createElement("ul");

    if (stories.length === 0) {
      const noStoriesMessage = document.createElement("p");
      noStoriesMessage.textContent = "Tidak ada cerita untuk ditampilkan.";
      listContainer.appendChild(noStoriesMessage);
    } else {
      for (let index = 0; index < stories.length; index++) {
        const story = stories[index];
        const storyItem = document.createElement("li");
        storyItem.classList.add("story-card");

        const mapId = `map-${index}`;
        const osmLink =
          story.lat != null && story.lon != null
            ? `https://www.openstreetmap.org/?mlat=${story.lat}&mlon=${story.lon}#map=15/${story.lat}/${story.lon}`
            : "#";
        const createdDate = new Date(story.createdAt).toLocaleDateString("id-ID");

        const isSaved = story.source === "local" || await this.presenter.isStorySaved(story.id);

        storyItem.innerHTML = `
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
                ` : ""}
                <p><em>"${story.description || ""}"</em></p>
              </div>
              <div class="story-right">
                <div id="${mapId}" class="map-box" aria-label="Peta lokasi cerita" style="height: 250px;"></div>
                ${story.lat != null && story.lon != null
                  ? `<p><a href="${osmLink}" target="_blank" rel="noopener">📍 Lihat lokasi di OpenStreetMap</a></p>`
                  : `<p><em>Lokasi tidak tersedia</em></p>`}
              </div>
            </div>
            ${story.source !== "local" ? `
              <button class="save-btn" data-id="${story.id}">
                ${isSaved ? "❌ Hapus Simpanan" : "⭐ Simpan Cerita"}
              </button>` : ""}
          </div>
        `;

        listContainer.appendChild(storyItem);

        if (story.lat != null && story.lon != null) {
          setTimeout(() => {
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
      }

      listContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("save-btn")) {
          const storyId = event.target.dataset.id;
          const isSaved = event.target.textContent.includes("Hapus");

          if (isSaved) {
            await this.presenter.removeStory(storyId);
          } else {
            await this.presenter.saveStory(storyId);
          }
        }
      });
    }

    container.appendChild(listContainer);

    const app = document.getElementById("app");
    app.innerHTML = "";

    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.textContent = "Lewati ke konten utama";
    skipLink.className = "skip-link";
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      container.focus();
    });

    app.appendChild(skipLink);
    app.appendChild(container);
  },

  renderError(message) {
    const container = document.createElement("div");
    container.id = "main-content";
    container.tabIndex = 0;

    const error = document.createElement("p");
    error.className = "error-message";
    error.textContent = message;

    container.appendChild(error);

    const app = document.getElementById("app");
    app.innerHTML = "";

    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.textContent = "Lewati ke konten utama";
    skipLink.className = "skip-link";
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      container.focus();
    });

    app.appendChild(skipLink);
    app.appendChild(container);
  },

  getCurrentStoryById(id) {
    return this.currentStories?.find((story) => story.id === id);
  },

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  },

  saveToBookmarkFailed(message) {
    alert(message);
  },

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  },

  removeFromBookmarkFailed(message) {
    alert(message);
  },
};

export default storyView;