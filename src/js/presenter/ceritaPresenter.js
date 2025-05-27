import { getStories } from "../model/api.js";
import storyView from "../view/storyView.js";
import {
  getAllLocalStories,
  getStoryById,
  saveStory,
  removeStory,
  isStorySaved,
} from "../model/indexedDB.js";

const storyPresenter = {
  async init(container) {
    container.innerHTML = "";

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Silakan login terlebih dahulu.");
      window.location.hash = "#/login";
      return;
    }

    try {
      let storyList = [];

      if (navigator.onLine) {
        storyList = await getStories(authToken);
        storyList = storyList.map(story => ({ ...story, source: "server" }));
      } else {
        storyList = await getAllLocalStories();
      }

      const storyListWithSavedStatus = await Promise.all(
        storyList.map(async story => {
          const saved = await isStorySaved(story.id);
          return { ...story, isSaved: saved };
        })
      );

      storyView.setPresenter(this);
      storyView.render(storyListWithSavedStatus);
    } catch (err) {
      storyView.renderError(`Gagal memuat data cerita: ${err.message}`);
    }
  },

  async saveStory(storyId) {
    try {
      let story = await getStoryById(storyId);

      if (!story && typeof storyView.getCurrentStoryById === "function") {
        story = storyView.getCurrentStoryById(storyId);
      }

      if (!story) throw new Error("Cerita tidak ditemukan.");

      if (!story.imageBlob && story.photoUrl) {
        const response = await fetch(story.photoUrl);
        story.imageBlob = await response.blob();
      }

      await saveStory(story);
      storyView.saveToBookmarkSuccessfully("Berhasil menyimpan cerita.");
      await this.refreshStories();
    } catch (error) {
      console.error("saveStory: error:", error);
      storyView.saveToBookmarkFailed(error.message);
    }
  },

  async removeStory(storyId) {
    try {
      await removeStory(storyId);
      storyView.removeFromBookmarkSuccessfully("Berhasil menghapus cerita.");
      await this.refreshStories();
    } catch (error) {
      console.error("removeStory: error:", error);
      storyView.removeFromBookmarkFailed(error.message);
    }
  },

  async isStorySaved(storyId) {
    return await isStorySaved(storyId);
  },

  async refreshStories() {
    const authToken = localStorage.getItem("token");
    let storyList = [];

    if (navigator.onLine) {
      storyList = await getStories(authToken);
      storyList = storyList.map(story => ({ ...story, source: "server" }));
    } else {
      storyList = await getAllLocalStories();
    }

    const storyListWithSavedStatus = await Promise.all(
      storyList.map(async story => {
        const saved = await isStorySaved(story.id);
        return { ...story, isSaved: saved };
      })
    );

    storyView.render(storyListWithSavedStatus);
  },
};

export default storyPresenter;