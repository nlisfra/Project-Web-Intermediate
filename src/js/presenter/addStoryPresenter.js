import addStoryView from '../view/addStoryView.js';
import { postStory } from '../model/api.js';

const addStoryPresenter = {
  async init(container) {
    container.innerHTML = '';
    addStoryView.render();
    addStoryView.bindSubmit(this.handleSubmit.bind(this));

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  },

  async handleSubmit({ description, imageBlob, lat, lon }) {
    if (!description || !imageBlob || lat === null || lon === null) {
      alert('Pastikan semua data diisi, foto diambil, dan lokasi dipilih.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      window.location.hash = '#/login';
      return;
    }

    if (!navigator.onLine) {
      alert('Anda sedang offline. Cerita tidak dapat dikirim.');
      return;
    }

    const storyData = {
      description,
      imageBlob,
      lat,
      lon,
    };

    try {
      const compressedBlob = await this.compressImage(storyData.imageBlob);

      const formData = new FormData();
      formData.append('description', storyData.description);
      formData.append('lat', storyData.lat);
      formData.append('lon', storyData.lon);
      formData.append('photo', compressedBlob, 'compressed.jpg');

      await postStory(token, formData);

      alert('✅ Cerita berhasil dikirim!');
      this.showLocalNotification('Cerita Baru', {
        body: 'Cerita kamu berhasil dikirim ke server.',
        icon: '/icons/icon-192.png',
      });

      window.location.hash = '#/stories';
    } catch (err) {
      console.error(err);
      alert('❌ Gagal mengirim cerita karena masalah koneksi atau server.');
      window.location.hash = '#/stories';
    }
  },

  compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        } else if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      img.src = URL.createObjectURL(file);
    });
  },

  takeScreenshot() {
    const target = document.querySelector('.container');
    if (!target) return;

    html2canvas(target).then(canvas => {
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  },

  showLocalNotification(title, options) {
    if (!("Notification" in window)) {
      console.log("Browser tidak mendukung Notifikasi");
      return;
    }

    if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.showNotification(title, options)
            .then(() => console.log("Notifikasi lokal dikirim lewat service worker"))
            .catch(e => console.error("Gagal kirim notifikasi lewat SW:", e));
        } else {
          try {
            new Notification(title, options);
            console.log("Notifikasi lokal dikirim lewat Notification API langsung");
          } catch (e) {
            console.error("Gagal kirim notifikasi langsung:", e);
          }
        }
      });
    } else {
      console.log("Izin notifikasi belum granted");
    }
  },

  destroy() {
    addStoryView.destroy();
  }
};

export default addStoryPresenter;