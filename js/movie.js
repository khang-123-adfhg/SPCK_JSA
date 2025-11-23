// ===== CONFIG TMDB =====
const API_KEY = "f24ec91a01ed8067e74d0728a8c3d636";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ===== API CALLS =====

// Lấy danh sách phim Anime (Animation = genre 16)
async function fetchAnimeMovies(page = 1) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=vi-VN&with_genres=16&page=${page}&sort_by=popularity.desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không thể tải dữ liệu anime");
  const data = await res.json();
  return data.results || [];
}

// Lấy chi tiết 1 phim
async function fetchMovieDetail(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=vi-VN`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không thể tải thông tin chi tiết phim");
  return await res.json();
}

// Tạo URL ảnh
function getImageUrl(path) {
  if (!path) return "img/background.jpg"; // ảnh fallback nếu phim không có poster
  return `${IMAGE_BASE_URL}${path}`;
}

// ===== HOME PAGE (index.html) =====
async function initHomePage() {
  const bannerContainer = document.getElementById("bannerContainer");
  const popularContainer = document.getElementById("popularContainer");

  // Nếu không phải index.html thì thoát
  if (!bannerContainer || !popularContainer) return;

  try {
    const movies = await fetchAnimeMovies(1);

    // 5 phim đầu cho banner
    bannerContainer.innerHTML = "";
    movies.slice(0, 5).forEach((movie, index) => {
      bannerContainer.innerHTML += `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <img src="${getImageUrl(movie.backdrop_path || movie.poster_path)}"
               class="d-block w-100 banner-img"
               alt="${movie.title}">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
            <h5>${movie.title}</h5>
            <p>${movie.overview || ""}</p>
            <button class="btn btn-info" onclick="viewMovie(${movie.id})">
              ▶ Xem ngay
            </button>
          </div>
        </div>`;
    });

    // 6 phim tiếp theo cho list “phim tình cảm” (ở đây vẫn là anime)
    popularContainer.innerHTML = "";
    movies.slice(5, 11).forEach((movie) => {
      const shortOverview = movie.overview
        ? movie.overview.length > 70
          ? movie.overview.slice(0, 70) + "..."
          : movie.overview
        : "";

      popularContainer.innerHTML += `
    <div class="col-md-4 mb-4">
      <div class="card bg-dark text-light h-100"
           onclick="viewMovie(${movie.id})"
           style="cursor:pointer;">
        <img src="${getImageUrl(movie.poster_path || movie.backdrop_path)}"
             class="card-img-top"
             alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title text-info">${movie.title}</h5>
          <p class="card-text">${shortOverview}</p>
        </div>
      </div>
    </div>`;
    });
  } catch (err) {
    console.error(err);
    bannerContainer.innerHTML = `<p class="text-danger text-center mt-3">Không tải được dữ liệu phim.</p>`;
  }
}

// Khi click “Xem ngay” từ index.html
function viewMovie(id) {
  localStorage.setItem("selectedMovieId", String(id));
  window.location.href = "movie.html"; // movie.html nằm cùng thư mục với index.html
}

// ===== MOVIE DETAIL PAGE (movie.html) =====
async function initMovieDetailPage() {
  const detailContainer = document.getElementById("movieDetail");
  if (!detailContainer) return; // không phải movie.html

  const id = localStorage.getItem("selectedMovieId");
  if (!id) {
    detailContainer.innerHTML = `
      <div class="text-center mt-5">
        <p class="text-danger">Không tìm thấy phim. Vui lòng quay lại trang chủ.</p>
        <a href="index.html" class="btn btn-secondary mt-3">← Quay lại</a>
      </div>`;
    return;
  }

  try {
    const movie = await fetchMovieDetail(id);

    detailContainer.innerHTML = `
      <div class="text-center">
        <img src="${getImageUrl(movie.backdrop_path || movie.poster_path)}"
             class="img-fluid rounded mb-4 detail-img">
        <h2 class="text-info">${movie.title}</h2>
        <p class="mt-3">
          ${movie.overview || "Chưa có mô tả cho phim này."}
        </p>
        <p class="mt-2">
          <strong>Ngày phát hành:</strong> ${movie.release_date || "N/A"}<br>
          <strong>Điểm TMDB:</strong> ${(movie.vote_average ?? 0).toFixed(
            1
          )} / 10
        </p>
        <a href="index.html" class="btn btn-secondary mt-3">← Quay lại</a>
      </div>`;
  } catch (err) {
    console.error(err);
    detailContainer.innerHTML = `
      <div class="text-center mt-5">
        <p class="text-danger">Không tải được chi tiết phim.</p>
        <a href="index.html" class="btn btn-secondary mt-3">← Quay lại</a>
      </div>`;
  }
}

// ===== LOGOUT CHUNG (index.html & movie.html) =====
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "signin.html"; // trang đăng nhập chính
  });
}

// ===== AUTO INIT =====
document.addEventListener("DOMContentLoaded", () => {
  setupLogout();
  initHomePage();
  initMovieDetailPage();
});
