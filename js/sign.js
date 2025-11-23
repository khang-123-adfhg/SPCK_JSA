// ====== HÀM DÙNG CHUNG CHO USER ======
function getUsers() {
  const raw = localStorage.getItem("users");
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Lỗi parse users:", e);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user, remember) {
  const data = JSON.stringify({
    email: user.email,
    username: user.username || "",
  });

  if (remember) {
    // nhớ đăng nhập (tắt trình duyệt / tắt Live Server vẫn còn nếu cùng port)
    localStorage.setItem("currentUser", data);
    sessionStorage.removeItem("currentUser");
  } else {
    // chỉ lưu cho phiên hiện tại
    sessionStorage.setItem("currentUser", data);
    localStorage.removeItem("currentUser");
  }
}

function getCurrentUser() {
  const raw =
    sessionStorage.getItem("currentUser") ||
    localStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Lỗi parse currentUser:", e);
    return null;
  }
}

// ====== MAIN ======
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm"); // html/signin.html
  const registerForm = document.getElementById("registerForm"); // html/signup.html
  const isAuthPage = !!(loginForm || registerForm);

  // 🔁 AUTO LOGIN: nếu đã có currentUser (nhất là do remember me) → vào thẳng index.html
  if (isAuthPage && getCurrentUser()) {
    window.location.href = "index.html";
    return;
  }

  // ----- ĐĂNG NHẬP (signin.html) -----
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email =
        document.getElementById("email")?.value.trim().toLowerCase() || "";
      const password = document.getElementById("password")?.value || "";
      const remember = document.getElementById("remember")?.checked || false;

      if (!email || !password) {
        alert("Vui lòng nhập đầy đủ email và mật khẩu");
        return;
      }

      const users = getUsers();
      const user = users.find(
        (u) =>
          u.email && u.email.toLowerCase() === email && u.password === password
      );

      if (!user) {
        alert("Email hoặc mật khẩu không đúng");
        return;
      }

      setCurrentUser(user, remember);
      window.location.href = "index.html";
    });
  }

  // ----- ĐĂNG KÝ (signup.html) -----
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username")?.value.trim() || "";
      const email =
        document.getElementById("email")?.value.trim().toLowerCase() || "";
      const password = document.getElementById("password")?.value || "";
      const confirmPassword =
        document.getElementById("confirmPassword")?.value || "";

      if (!username || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
      }

      const users = getUsers();
      if (users.some((u) => u.email && u.email.toLowerCase() === email)) {
        alert("Email này đã được đăng ký trước đó");
        return;
      }

      const newUser = { username, email, password };
      users.push(newUser);
      saveUsers(users);

      alert("Đăng ký thành công! Hãy đăng nhập.");
      window.location.href = "signin.html";
    });
  }
});
