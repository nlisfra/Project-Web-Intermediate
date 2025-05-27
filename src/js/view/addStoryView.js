const addStoryView = {
  stream: null,
  submitHandler: null,
  selectedLat: null,
  selectedLon: null,

  render() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <main id="main-content">
        <h2>🌟 Bagikan Ceritamu</h2>
        <form id="addStoryForm" class="story-form">
          <label for="description">📝 Ceritakan pengalamanmu:</label>
          <textarea id="description" required aria-required="true" placeholder="Contoh: Aku melihat matahari terbit..."></textarea>

          <label for="video">📷 Ambil Gambar dari Kamera:</label>
          <button type="button" id="startCameraBtn" class="button">🎥 Mulai Kamera</button>
          <video id="video" width="300" autoplay playsinline style="display: none;"></video>
          <button type="button" id="captureBtn" class="button" style="display: none;">📸 Ambil Foto</button>

          <canvas id="canvas" width="300" height="225" style="display: none;"></canvas>
          <img id="preview" alt="Pratinjau hasil foto" style="max-width: 300px; display: none;" />

          <input type="file" id="photoInput" accept="image/*" capture="environment" />

          <fieldset>
            <legend>🗺️ Pilih Lokasi Cerita</legend>
            <div id="mapPicker" style="height: 300px;"></div>
            <p>🌐 Koordinat Terpilih: <strong>Latitude:</strong> <span id="latDisplay">-</span> | <strong>Longitude:</strong> <span id="lonDisplay">-</span></p>
          </fieldset>

          <button type="submit" class="button submit-btn">✅ Tambahkan Cerita</button>
        </form>
      </main>
    `;

    this.initCameraControls();
    this.initMap();
    this.initPhotoInput();
    this.insertScreenshotButton();

    return app;
  },

  insertScreenshotButton() {
    const form = document.getElementById("addStoryForm");
    if (form && !document.querySelector(".screenshot-button")) {
      const btn = document.createElement("button");
      btn.textContent = "📸 Screenshot Halaman";
      btn.classList.add("screenshot-button");
      btn.type = "button";
      btn.addEventListener("click", () => {
        const target = document.querySelector('main');
        if (!target) return;
        html2canvas(target).then(canvas => {
          const link = document.createElement('a');
          link.download = 'screenshot.png';
          link.href = canvas.toDataURL();
          link.click();
        });
      });
      form.appendChild(btn);
    }
  },

  async initCameraControls() {
    const startCameraBtn = document.getElementById("startCameraBtn");
    const video = document.getElementById("video");
    const captureBtn = document.getElementById("captureBtn");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");

    const screenshotBtn = document.createElement("button");
    screenshotBtn.id = "screenshotBtn";
    screenshotBtn.textContent = "📸 Screenshot Layar";
    screenshotBtn.className = "button";
    screenshotBtn.style.display = "none";
    captureBtn.insertAdjacentElement("afterend", screenshotBtn);

    let stream = null;

    startCameraBtn.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.stream = stream;
        video.srcObject = stream;

        video.style.display = "block";
        captureBtn.style.display = "inline-block";
        screenshotBtn.style.display = "inline-block";
        startCameraBtn.style.display = "none";
      } catch (err) {
        console.error("Gagal mengakses kamera:", err);
        alert("Tidak dapat mengakses kamera.");
      }
    });

    captureBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        preview.src = URL.createObjectURL(blob);
        preview.style.display = "block";
        preview.blob = blob;

        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
          stream = null;
        }

        video.srcObject = null;
        video.style.display = "none";
        captureBtn.style.display = "none";
        screenshotBtn.style.display = "none";
        startCameraBtn.style.display = "inline-block";
      }, "image/jpeg");
    });

    screenshotBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        preview.src = URL.createObjectURL(blob);
        preview.style.display = "block";
        preview.blob = blob;
        // Kamera tetap menyala
      }, "image/jpeg");
    });
  },

  initPhotoInput() {
    const photoInput = document.getElementById("photoInput");
    const preview = document.getElementById("preview");

    photoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
        preview.blob = file;
      }
    });
  },

  initMap() {
    this.selectedLat = null;
    this.selectedLon = null;

    const map = L.map("mapPicker").setView([-6.2, 106.8], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;

      document.getElementById("latDisplay").textContent = this.selectedLat.toFixed(5);
      document.getElementById("lonDisplay").textContent = this.selectedLon.toFixed(5);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
  },

  bindSubmit(handler) {
    const form = document.getElementById("addStoryForm");
    if (form) {
      // Remove previous listener jika ada
      if (this.submitHandler) {
        form.removeEventListener("submit", this.submitHandler);
      }
      this.submitHandler = (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const preview = document.getElementById("preview");
        const imageBlob = preview.blob;
        const lat = this.selectedLat;
        const lon = this.selectedLon;
        handler({ description, imageBlob, lat, lon });
      };
      form.addEventListener("submit", this.submitHandler);
    }
  },

  destroy() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    const video = document.getElementById("video");
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }

    const form = document.getElementById("addStoryForm");
    if (form && this.submitHandler) {
      form.removeEventListener("submit", this.submitHandler);
      this.submitHandler = null;
    }
  },
};

export default addStoryView;