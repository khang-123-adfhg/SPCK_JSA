const movies = [
  // 5 phim anime kịch tính
  {
    id: 1,
    title: "Attack on Titan",
    description: "Cuộc chiến sinh tồn giữa nhân loại và Titan khổng lồ.",
    image: "img/attackontitan.jpg"
  },
  {
    id: 2,
    title: "Chuyển sinh thành Slime",
    description: "Một người bình thường chuyển sinh thành slime mạnh nhất.",
    image: "img/tensura.jpg"
  },
  {
    id: 3,
    title: "One Piece",
    description: "Hành trình của Luffy tìm kho báu One Piece huyền thoại.",
    image: "img/onepiece.jpg"
  },
  {
    id: 4,
    title: "Demon Slayer",
    description: "Tanjiro chiến đấu để cứu em gái khỏi lời nguyền quỷ.",
    image: "img/demonslayer.jpg"
  },
  {
    id: 5,
    title: "Naruto",
    description: "Câu chuyện về cậu bé ninja khao khát trở thành Hokage.",
    image: "img/naruto.jpg"
  },

  // 6 phim tình cảm
  {
    id: 6,
    title: "Hoa Thơm Kiêu Hãnh",
    description: "Một chuyện tình nhẹ nhàng giữa hai con người khác biệt.",
    image: "img/hoathomkieuhanh.jpg"
  },
  {
    id: 7,
    title: "My Dress-Up Darling",
    description: "Câu chuyện cosplay và tình yêu tuổi học trò.",
    image: "img/mydressupdarling.jpg"
  },
  {
    id: 8,
    title: "Kimi no Na wa (Your Name)",
    description: "Hai người lạ hoán đổi cơ thể và tìm nhau giữa thời gian.",
    image: "img/yourname.jpg"
  },
  {
    id: 9,
    title: "Your Lie in April",
    description: "Thiên tài piano và cô gái thay đổi cuộc đời cậu mãi mãi.",
    image: "img/yourlieinapril.jpg"
  },
  {
    id: 10,
    title: "A Silent Voice",
    description: "Một cậu bé chuộc lỗi vì bắt nạt cô bạn khiếm thính.",
    image: "img/silent voice.jpg"
  },
  {
    id: 11,
    title: "Weathering With You",
    description: "Chàng trai gặp cô gái có thể điều khiển thời tiết.",
    image: "img/weatheringwithyou.jpg"
  }
];

// ...existing code...
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', () => {
      // xóa thông tin đăng nhập
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      // chuyển về trang đăng nhập (chỉnh path nếu cần)
      location.href = 'mainpage\signin.html';
    });
  });
})();
// ...existing code...