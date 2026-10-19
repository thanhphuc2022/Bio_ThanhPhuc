# Phuc Card

Bio eCard cá nhân của Hồ Thanh Phúc, dùng Next.js, React, TypeScript và CSS. Trang hiển thị hồ sơ, liên kết liên hệ, ba tùy chọn nhận chuyển khoản, mã QR chia sẻ trang và danh bạ vCard.

## Chạy dự án

```bash
npm ci
npm run dev
```

Mở `http://localhost:3000`. Các lệnh dự án:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Cập nhật thông tin và ảnh

- Sửa tên, nghề nghiệp, điện thoại, liên kết và cấu hình các tài khoản trong [`src/data/profile.ts`](src/data/profile.ts).
- Thay avatar tại `public/images/avatar.png`; đường dẫn, mô tả và vị trí ảnh được khai báo trong `profile.avatar`.
- Ảnh QR dùng để hiển thị được khai báo tại `qrImage.src` (`*_display.png`). Ảnh tải về là file gốc tại `qrImage.originalSrc` (`.jpg`). Giữ nguyên hai vai trò này khi thay ảnh.
- QR nhận tiền là ảnh ngân hàng của từng tài khoản. QR chia sẻ trang được tạo riêng từ URL hiện tại qua dịch vụ bên ngoài `api.qrserver.com`; chức năng này phụ thuộc dịch vụ đó.
