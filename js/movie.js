// ===== CONFIG TMDB =====
const API_KEY = "f24ec91a01ed8067e74d0728a8c3d636";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ===== API CALLS =====

// Lấy danh sách anime (Animation = 16)
async function fetchAnimeMovies(page = 1) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=vi-VN&with_genres=16&page=${page}&sort_by=popularity.desc`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không thể tải danh sách anime");
  const data = await res.json();
  return data.results || [];
}

// Search phim
async function searchMovies(keyword) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=vi-VN&query=${encodeURIComponent(
    keyword
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không tìm được phim");
  const data = await res.json();
  return data.results || [];
}

// Lấy chi tiết phim
async function fetchMovieDetail(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=vi-VN`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không thể tải chi tiết phim");
  return await res.json();
}

// ===== HELPER =====
function getImageUrl(path) {
  if (!path) return "../img/background.jpg";
  return `${IMAGE_BASE_URL}${path}`;
}

// ===== HOME PAGE =====
async function initHomePage() {
  const banner = document.getElementById("bannerContainer");
  const popular = document.getElementById("popularContainer");
  const romantic = document.getElementById("RomanticContainer");
  const sci = document.getElementById("SciencefictionContainer");

  if (!banner || !popular || !romantic || !sci) return;

  try {
    const movies = await fetchAnimeMovies(1);

    // ----- Banner -----
    banner.innerHTML = "";
    movies.slice(0, 5).forEach((m, i) => {
      banner.innerHTML += `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <img src="${getImageUrl(
            m.backdrop_path || m.poster_path
          )}" class="d-block w-100 banner-img">
          <div class="carousel-caption bg-dark bg-opacity-50 rounded">
            <h5>${m.title}</h5>
            <p>${m.overview || ""}</p>
            <button class="btn btn-info" onclick="viewMovie(${m.id})">
              ▶ Xem ngay
            </button>
          </div>
        </div>`;
    });

    // ----- Popular -----
    renderMovieList(popular, movies.slice(5, 11));

    // ----- Romantic -----
    renderMovieList(romantic, movies.slice(11, 17));

    // ----- Science Fiction -----
    renderMovieList(sci, movies.slice(17, 23));
  } catch (err) {
    console.error(err);
    popular.innerHTML =
      "<p class='text-danger'>Không tải được dữ liệu phim</p>";
  }
}

// Render list phim
function renderMovieList(container, movies) {
  container.innerHTML = "";
  movies.forEach((m) => {
    const overview =
      m.overview && m.overview.length > 70
        ? m.overview.slice(0, 70) + "..."
        : m.overview || "";

    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card bg-dark text-light h-100"
             onclick="viewMovie(${m.id})"
             style="cursor:pointer;">
          <img src="${getImageUrl(m.poster_path)}" class="card-img-top">
          <div class="card-body">
            <h5 class="text-info">${m.title}</h5>
            <p>${overview}</p>
          </div>
        </div>
      </div>`;
  });
}

// ===== SEARCH =====
function renderSearchResult(movies) {
  const container = document.getElementById("popularContainer");
  if (!container) return;

  container.innerHTML = "";

  if (movies.length === 0) {
    container.innerHTML = "<p class='text-warning'>Không tìm thấy phim</p>";
    return;
  }

  movies.forEach((m) => {
    const overview =
      m.overview && m.overview.length > 70
        ? m.overview.slice(0, 70) + "..."
        : m.overview || "";

    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card bg-dark text-light h-100"
             onclick="viewMovie(${m.id})"
             style="cursor:pointer;">
          <img src="${getImageUrl(m.poster_path)}" class="card-img-top">
          <div class="card-body">
            <h5 class="text-info">${m.title}</h5>
            <p>${overview}</p>
          </div>
        </div>
      </div>`;
  });
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  let timer = null;

  input.addEventListener("input", () => {
    clearTimeout(timer);
    const keyword = input.value.trim();

    timer = setTimeout(async () => {
      if (!keyword) {
        initHomePage();
        return;
      }
      try {
        const results = await searchMovies(keyword);
        renderSearchResult(results);
      } catch (e) {
        console.error(e);
      }
    }, 500);
  });
}

// ===== MOVIE DETAIL PAGE =====
async function initMovieDetailPage() {
  const container = document.getElementById("movieDetail");
  if (!container) return;

  const id = localStorage.getItem("selectedMovieId");
  if (!id) {
    container.innerHTML = "<p class='text-danger'>Không tìm thấy phim</p>";
    return;
  }

  try {
    const movie = await fetchMovieDetail(id);
    container.innerHTML = `
      <div class="text-center">
        <img src="${getImageUrl(
          movie.backdrop_path || movie.poster_path
        )}" class="img-fluid rounded mb-4">
        <h2 class="text-info">${movie.title}</h2>
        <p>${movie.overview || "Chưa có mô tả"}</p>
        <p>
          <strong>Ngày phát hành:</strong> ${movie.release_date || "N/A"}<br>
          <strong>Điểm:</strong> ${movie.vote_average?.toFixed(1) || 0} / 10
        </p>
        <a href="index.html" class="btn btn-secondary">← Quay lại</a>
      </div>`;
  } catch (err) {
    console.error(err);
  }
}

// ===== VIEW MOVIE =====
function viewMovie(id) {
  localStorage.setItem("selectedMovieId", id);
  window.location.href = "movie.html";
}

// ===== LOGOUT =====
function setupLogout() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "signin.html";
  });
}

// ===== AUTO INIT =====
document.addEventListener("DOMContentLoaded", () => {
  setupLogout();
  initHomePage();
  initMovieDetailPage();
  setupSearch();
});
