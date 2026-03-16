(function() {
   // --- Phần cấu hình ---
   const snowMax = 335; // Số lượng bông tuyết tối đa
   const snowColor = ["#F1F1F1", "#EDEDEDbf"]; // Màu sắc bông tuyết
   const snowEntity = "&#x2022;"; // Ký tự bông tuyết (•)
   const snowSpeed = 0.5; // Tốc độ rơi cơ bản
   const snowMinSize = 15; // Kích thước bông tuyết nhỏ nhất (px)
   const snowMaxSize = 28; // Kích thước bông tuyết lớn nhất (px)
   const snowStyles = "cursor: default; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none;";

   // --- Biến nội bộ ---
   let snow = []; // Mảng chứa các phần tử bông tuyết
   let pos = []; // Dùng cho tính toán dao động ngang
   let coords = []; // Dùng cho tính toán dao động ngang
   let lefr = []; // Biên độ dao động ngang
   let marginBottom, marginRight; // Giới hạn của khu vực tuyết rơi

   /**
    * Tạo số ngẫu nhiên trong một khoảng
    * @param {number} range - Giới hạn trên (không bao gồm)
    * @returns {number} Số nguyên ngẫu nhiên
    */
   function randomise(range) {
      return Math.floor(range * Math.random());
   }

   /**
    * Khởi tạo các bông tuyết
    */
   function initSnow() {
      const snowSizeRange = snowMaxSize - snowMinSize;
      marginBottom = document.body.scrollHeight - 5;
      marginRight = document.body.clientWidth - 15;

      const snowContainer = document.body;

      for (let i = 0; i <= snowMax; i++) {
         const flake = document.createElement("span");
         flake.innerHTML = snowEntity;

         // Áp dụng các style từ chuỗi snowStyles
         flake.setAttribute('style', snowStyles);

         // Áp dụng các style cụ thể cần thiết cho định vị và hiển thị
         flake.style.position = "absolute";
         flake.style.fontFamily = "inherit";
         flake.style.zIndex = 1000;

         // Tính toán và áp dụng các thuộc tính ngẫu nhiên cho bông tuyết
         const currentFlakeSize = randomise(snowSizeRange) + snowMinSize;
         flake.style.fontSize = currentFlakeSize + "px";
         flake.style.color = snowColor[randomise(snowColor.length)];

         // Lưu trữ các thuộc tính tùy chỉnh trực tiếp trên đối tượng DOM của bông tuyết
         flake.size = currentFlakeSize;
         flake.sink = (snowSpeed * flake.size) / 20; // Tốc độ rơi dựa trên kích thước
         flake.posX = randomise(marginRight - flake.size); // Vị trí X ban đầu
         // Vị trí Y ban đầu được phân bố ngẫu nhiên trên chiều cao trang
         flake.posY = randomise(marginBottom - 2 * flake.size);

         flake.style.left = flake.posX + "px";
         flake.style.top = flake.posY + "px";

         // Lưu trữ thông tin cho animation
         snow[i] = flake;
         coords[i] = 0; // Góc ban đầu cho dao động sin
         lefr[i] = Math.random() * 10; // Biên độ dao động ngang
         pos[i] = 0.02 + Math.random() / 100; // Tần số/tốc độ dao động ngang

         snowContainer.appendChild(flake); // Thêm bông tuyết vào trang
      }
      moveSnow(); // Bắt đầu animation
   }

   /**
    * Cập nhật kích thước khi cửa sổ thay đổi
    */
   function resize() {
      marginBottom = document.body.scrollHeight - 5;
      marginRight = document.body.clientWidth - 15;
   }

   /**
    * Di chuyển các bông tuyết (vòng lặp animation)
    */
   function moveSnow() {
      for (let i = 0; i <= snowMax; i++) {
         const flake = snow[i];
         if (!flake) continue; // Bỏ qua nếu bông tuyết không tồn tại

         coords[i] += pos[i]; // Cập nhật góc cho dao động
         flake.posY += flake.sink; // Di chuyển tuyết xuống theo chiều dọc

         // Tính toán vị trí X mới với hiệu ứng dao động ngang
         const currentX = flake.posX + lefr[i] * Math.sin(coords[i]);
         flake.style.left = currentX + "px";
         flake.style.top = flake.posY + "px";

         // Kiểm tra nếu bông tuyết ra khỏi màn hình (dưới hoặc phải) và reset vị trí của nó về đầu trang
         if (
            flake.posY >= marginBottom - 2 * flake.size || // Ra khỏi cạnh dưới
            currentX > marginRight - 3 * lefr[i]          // Ra khỏi cạnh phải (logic gốc)
            // Có thể thêm kiểm tra cạnh trái nếu muốn: currentX < -flake.size - lefr[i]
         ) {
            flake.posX = randomise(marginRight - flake.size); // Vị trí X ngẫu nhiên mới
            flake.posY = 0; // Reset về đầu trang
         }
      }
      requestAnimationFrame(moveSnow); // Sử dụng requestAnimationFrame cho animation mượt mà hơn
   }

   // Gắn các sự kiện
   window.addEventListener("resize", resize);
   window.addEventListener("load", initSnow);

})();