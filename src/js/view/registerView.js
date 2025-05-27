const registerView = {
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <main id="main-content">
        <form id="registerForm" aria-label="Form pendaftaran pengguna">
            <h2>Registrasi</h2>
            <label for="name">Nama:</label>
            <input type="text" id="name" name="name" required aria-required="true" placeholder="masukkan username"/>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-required="true" placeholder="masukkan email"/>

            <label for="password">Kata Sandi:</label>
            <input type="password" id="password" name="password" required aria-required="true"  placeholder="masukkan kata sandi"/>

          <button type="submit">Daftar</button>
          <p>Sudah punya akun? <a href="#/login" id="goToLogin">Login di sini</a></p>
        </form>
      </main>
    `;

    this._form = wrapper.querySelector("#registerForm");

    const loginLink = wrapper.querySelector("#goToLogin");
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.startTransitionToLogin();
    });

    return wrapper;
  },

  bindSubmit(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = this._form.querySelector("#name").value.trim();
      const email = this._form.querySelector("#email").value.trim();
      const password = this._form.querySelector("#password").value.trim();
      handler({ name, email, password });
    });
  },

  startTransitionToLogin() {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.hash = "#/login";
      });
    } else {
      window.location.hash = "#/login";
    }
  },
};

export default registerView;