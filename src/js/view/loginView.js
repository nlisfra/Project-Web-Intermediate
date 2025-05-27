const loginView = {
  render() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <main id="main-content">
        <form id="loginForm" aria-label="Form login pengguna" class="login">
          <h2>Masuk</h2>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required aria-required="true" placeholder="masukkan email" />

          <label for="password">Kata Sandi:</label>
          <input type="password" id="password" name="password" required aria-required="true" placeholder="masukkan kata sandi"/>

          <button type="submit">Masuk</button>
          <p>Belum punya akun? <a href="#/register" id="goToRegister">Daftar di sini</a></p>
        </form>
      </main>
    `;

    this._form = wrapper.querySelector("#loginForm");

    const registerLink = wrapper.querySelector("#goToRegister");
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.startTransitionToRegister();
    });

    return wrapper;
  },

  bindSubmit(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = this._form.querySelector("#email").value.trim();
      const password = this._form.querySelector("#password").value.trim();

      if (email === "" || password === "") {
        alert("Email dan kata sandi harus diisi.");
        return;
      }

      handler({ email, password });
    });
  },

  startTransitionToRegister() {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.hash = "#/register";
      });
    } else {
      window.location.hash = "#/register";
    }
  },
};

export default loginView;