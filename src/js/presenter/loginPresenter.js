import { login } from "../model/api.js";
import loginView from "../view/loginView.js";

const loginPresenter = {
  async init(container) {
    container.innerHTML = "";
    container.appendChild(loginView.render());

    loginView.bindSubmit(async ({ email, password }) => {
      try {
        const { token, name } = await login(email, password);
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        alert("Login berhasil!");
        window.location.hash = "#/stories";
      } catch (error) {
        alert("Login gagal: " + error.message);
      }
    });
  },
};

export default loginPresenter;