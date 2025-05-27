function updateNavbar() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  nav.innerHTML = "";

  const isLoggedIn = !!localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // Wrapper utama untuk navbar
  const navWrapper = document.createElement("div");
  navWrapper.className = "nav-wrapper";

  // Bagian kiri navbar (nama & link)
  const navLeft = document.createElement("div");
  navLeft.className = "nav-left";

  if (name) {
    const span = document.createElement("span");
    span.textContent = `Hi, ${name}`;
    navLeft.appendChild(span);
  }

  const links = [
    { href: "#/login", label: "Home", show: !isLoggedIn },
    { href: "#/stories", label: "Stories", show: isLoggedIn },
    { href: "#/add", label: "Add Story", show: isLoggedIn },
    { href: "#/saved", label: "Saved Stories", show: isLoggedIn },
    { href: "#/register", label: "Register", show: !isLoggedIn },
  ];

  links.forEach(({ href, label, show }) => {
    if (show) {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = label;
      navLeft.appendChild(a);
    }
  });

  // Tambahkan navLeft ke wrapper
  navWrapper.appendChild(navLeft);

  // Bagian kanan: tombol logout
  if (isLoggedIn) {
    const navRight = document.createElement("div");
    navRight.className = "nav-right";

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.classList.add("logout-button");

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      alert("Berhasil logout!");
      window.location.hash = "#/login";
      updateNavbar();
    });

    navRight.appendChild(logoutBtn);
    navWrapper.appendChild(navRight);
  }

  nav.appendChild(navWrapper);
}

export default updateNavbar;