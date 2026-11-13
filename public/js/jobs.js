document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      const isConfirmed = confirm(
        "Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác!",
      );
      if (!isConfirmed) {
        e.preventDefault();
      }
    });
  });
  const successMsg = document.getElementById("success-message");
  if (successMsg) {
    // 1 Xóa tham số trên URL
    window.history.replaceState(null, "", window.location.pathname);

    // 2 Đợi 100ms (để trình duyệt kịp vẽ cái thẻ div) rồi thêm class 'show' để trượt vào
    setTimeout(() => {
      successMsg.classList.add("show");
    }, 100);

    // 3 Đợi 5 giây, xóa class 'show' để trượt ra
    setTimeout(() => {
      successMsg.classList.remove("show");

      // 4 Đợi hiệu ứng trượt ra chạy xong (0.5s) thì xóa hẳn thẻ div khỏi HTML
      setTimeout(() => {
        successMsg.remove();
      }, 500);
    }, 5000);
  }
});
