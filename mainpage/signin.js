// ...existing code...
// nếu đã đăng nhập rồi thì chuyển thẳng tới trang chủ
if (localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")) {
  location.href = "index.html";
}

const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";
    const remember = form.querySelector('input[type="checkbox"]')?.checked;

    const usersRaw = localStorage.getItem("users");
    if (!usersRaw) {
      alert("Không có tài khoản. Vui lòng đăng ký trước.");
      return;
    }

    let users;
    try {
      users = JSON.parse(usersRaw);
    } catch (err) {
      alert("Dữ liệu người dùng bị lỗi.");
      return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert("Email hoặc mật khẩu không đúng.");
      return;
    }

    // lưu current user để tự động đăng nhập lần sau
    const current = { email: user.email, username: user.username || "" };
    if (remember) {
      localStorage.setItem("currentUser", JSON.stringify(current));
    } else {
      sessionStorage.setItem("currentUser", JSON.stringify(current));
    }

    // chuyển tới trang chủ
    location.href = "index.html";
  });
}

// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const redirectPath = '../../mainpage/index.html'; // đường dẫn tới file index của bạn
  const form = document.getElementById('loginForm');
  const fallbackButtons = document.querySelectorAll('.btn-signin'); // optional

  function signInAndRedirect() {
    const email = (document.getElementById('email') || {}).value || '';
    // lưu thông tin currentUser để lần sau tự động vào được
    localStorage.setItem('currentUser', JSON.stringify({ email }));
    // chuyển tới trang chính
    location.href = redirectPath;
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      // thêm validate nếu cần
      signInAndRedirect();
    });
  }

  fallbackButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      signInAndRedirect();
    });
  });
});
// ...existing code...
// ...existing code...