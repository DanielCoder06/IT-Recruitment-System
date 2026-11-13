document.addEventListener("DOMContentLoaded", () => {
  // 1 Khởi tạo CKEditor
  let editorInstance;
  ClassicEditor.create(document.querySelector("#editor"))
    .then((editor) => {
      editorInstance = editor;
      console.log("CKEditor ready!");
    })
    .catch((error) => console.error("Lỗi CKEditor:", error));

  // 2 Flag đánh dấu trạng thái đã thay đổi
  let isDirty = false;

  // 3 Lắng nghe sự kiện thay đổi ô input
  document.querySelectorAll("#editForm input").forEach((input) => {
    input.addEventListener("input", () => {
      isDirty = true;
    });
  });

  // 4 Lăng nghe sự kiện thay đổi trên CKEditor
  const checkEditor = setInterval(() => {
    if (editorInstance) {
      clearInterval(editorInstance);

      editorInstance.model.document.on("change:data", () => {
        isDirty = true;
      });
    }
  }, 200);

  // 5 Bắt xử kiện ấn nút hủy
  const btnCancel = document.getElementById("btn-cancel");
  if (btnCancel) {
    btnCancel.addEventListener("click", (e) => {
      if (isDirty) {
        e.preventDefault(); // Chặn chuyển trang
        const confirmLeave = confirm(
          "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn thoát?",
        );
        if (confirmLeave) {
          window.location.href = "/company/jobs"; // Đồng ý thì chuyển
        }
      }
    });
  }
});
