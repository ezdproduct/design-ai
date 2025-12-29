# 🎨 Chào mừng bạn đến với Xưởng Vẽ Thần Kỳ (vue-fabric-editor)!

Chào các bạn nhỏ (và cả những bạn lớn nữa)! Hôm nay chúng mình sẽ cùng khám phá xem "cỗ máy" thiết kế này hoạt động như thế nào nhé. Hãy tưởng tượng đây là một bàn làm việc phép thuật, nơi bạn có thể tạo ra mọi thứ mình thích!

---

## 🖼️ 1. Tờ Giấy Phép Thuật (The Canvas)
Ở giữa màn hình có một khu vực trắng tinh, đó chính là **Canvas**. 
*   **Nó là gì?** Nó giống như một tờ giấy trắng nhưng cực kỳ đặc biệt.
*   **Phép thuật ở đâu?** Bình thường, nếu bạn vẽ lên giấy, bạn không thể nhấc hình đó lên và di chuyển đi chỗ khác. Nhưng ở đây, mọi thứ bạn vẽ vào đều "biết đi"! Bạn có thể nắm lấy một bông hoa, kéo sang trái, xoay vòng tròn hoặc phóng to nó ra như thổi bong bóng vậy.
*   **Ai điều khiển?** Một "chú robot" tên là **Fabric.js** lo việc này. Chú robot này giúp tờ giấy hiểu được bạn đang muốn cầm, nắm hay xoay cái gì.

## 🧰 2. Hộp Đồ Chơi Khổng Lồ (Components & Tools)
Ở bên cạnh tờ giấy là một chiếc hộp đựng rất nhiều đồ chơi:
*   **Hình khối:** Hình vuông, hình tròn, hình ngôi sao... Giống như những miếng ghép Lego vậy.
*   **Chữ viết:** Bạn có thể viết tên mình lên, chọn màu sắc rực rỡ và kiểu chữ uốn lượn.
*   **Ảnh:** Bạn có thể dán những bức ảnh đẹp từ máy tính vào đây.
*   **Lớp (Layers):** Hãy tưởng tượng bạn đang chồng những tấm kính lên nhau. Tấm kính nào đặt sau thì hình sẽ nằm dưới, tấm nào đặt trước thì hình sẽ nằm trên. Bạn có thể thay đổi thứ tự của chúng một cách dễ dàng!

## 🧠 3. Bộ Não Thông Minh (Vue.js)
Để mọi thứ hoạt động trơn tru, chúng mình có một "bộ não" điều chỉ huy tên là **Vue.js**.
*   **Nhiệm vụ:** Khi bạn bấm vào cái nút "Đổi màu đỏ", bộ não Vue sẽ nói với chú robot Fabric: "Này, hãy tô màu đỏ cho hình này nhé!". 
*   **Sự ngăn nắp:** Vue giúp chia cái bàn làm việc này thành các ngăn nhỏ (gọi là Components). Một ngăn để chọn màu, một ngăn để chọn hình, giúp mọi thứ không bị rối tung lên.

## 💾 4. Cất Giữ Tác Phẩm (Export & Save)
Sau khi vẽ xong một bức tranh tuyệt đẹp, bạn sẽ làm gì?
*   **Chụp ảnh:** Bạn bấm nút, và "tách!", cỗ máy sẽ biến toàn bộ tờ giấy phép thuật thành một bức ảnh (định dạng PNG hoặc JPG) để bạn gửi cho bạn bè.
*   **Ghi nhớ:** Cỗ máy cũng có thể biến bức tranh thành một đoạn mã bí mật (JSON). Lần sau bạn chỉ cần đưa đoạn mã này vào, bức tranh sẽ hiện ra y hệt như cũ để bạn vẽ tiếp!

---

## 🚀 Làm sao để bắt đầu?
1.  **Mở cửa xưởng vẽ:** Dùng lệnh `pnpm dev`.
2.  **Chọn đồ chơi:** Bấm vào các hình ở thanh công cụ.
3.  **Trở thành họa sĩ:** Kéo thả, đổi màu và sáng tạo thôi!

Hy vọng bản hướng dẫn này giúp bạn hiểu hơn về món đồ chơi công nghệ siêu cấp này. Chúc bạn có những giờ phút sáng tạo thật vui! 🌟
