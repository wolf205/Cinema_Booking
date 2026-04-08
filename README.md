# 🎬 CineBooking API

REST API cho hệ thống đặt vé xem phim, xây dựng theo kiến trúc **Domain-Driven Design (DDD)** với Node.js, Express và MySQL.

---

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Kiến trúc](#kiến-trúc)
- [Tech Stack](#tech-stack)
- [Cài đặt](#cài-đặt)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Chạy dự án](#chạy-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API Reference](#api-reference)
- [Luồng nghiệp vụ chính](#luồng-nghiệp-vụ-chính)
- [Database Schema](#database-schema)
- [Các quyết định thiết kế](#các-quyết-định-thiết-kế)

---

## Tổng quan

CineBooking API cung cấp đầy đủ backend cho ứng dụng đặt vé rạp chiếu phim, bao gồm:

- Quản lý phim, rạp, phòng chiếu, ghế ngồi
- Quản lý lịch chiếu (showtime) với kiểm tra conflict
- Đặt vé, giữ ghế tạm thời (10 phút), xác nhận thanh toán
- Payment session với mock checkout và chuẩn bị tích hợp VNPay/Momo
- Upload ảnh lên Cloudinary
- Xác thực người dùng với JWT + Refresh Token
- Phân quyền admin / user

---

## Kiến trúc

Dự án theo **Domain-Driven Design** với 3 tầng tách biệt hoàn toàn:

```
Domain → Application → Infrastructure
```

- **Domain**: Entity, Value Object, Repository Interface — không phụ thuộc bất kỳ framework nào
- **Application**: Command/Query handlers (CQRS-style) — chứa toàn bộ logic nghiệp vụ
- **Infrastructure**: MySQL repositories, Express controllers, routes, middlewares

Dependency injection được quản lý tập trung qua `container.js`, theo thứ tự khởi tạo: **Repository → Handler → Controller**.

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| Database | MySQL 8+ |
| ORM/Driver | mysql2/promise |
| Auth | JWT + bcrypt |
| File Upload | Cloudinary + multer-storage-cloudinary |
| Validation | Tự implement qua Command/Entity |

---

## Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd cinebooking-api

# Cài dependencies
npm install

# Tạo database
mysql -u root -p < schema.sql
```

---

## Cấu hình môi trường

Tạo file `.env` ở root:

```env
PORT=3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=cinebooking

JWT_SECRET=your_super_secret_key_here

NODE_ENV=development

# Cloudinary (cần cho upload ảnh)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Chạy dự án

```bash
# Development (với nodemon)
npm run dev

# Production
npm start
```

Server sẽ chạy tại `http://localhost:3000`. Kiểm tra bằng:

```bash
GET /health
# → { "message": "OK" }
```

---

## Cấu trúc thư mục

```
src/
├── app.js
├── server.js
│
├── Domain/                         # Tầng Domain — không phụ thuộc gì
│   ├── Errors/
│   │   └── AppError.js
│   ├── User/
│   │   ├── Entity/
│   │   │   ├── User.js
│   │   │   └── RefreshToken.js
│   │   ├── ValueObject/
│   │   │   └── Email.js
│   │   └── Repository/
│   │       ├── UserRepositoryInterface.js
│   │       └── RefreshTokenRepositoryInterface.js
│   ├── Movie/
│   ├── Cinema/                     # Cinema, Room, Seat
│   ├── Showtime/
│   ├── Booking/                    # Booking, BookingSeat
│   └── Payment/
│       ├── Entity/
│       │   └── Payment.js
│       └── Repository/
│           └── PaymentRepositoryInterface.js
│
├── Application/                    # Tầng Application — logic nghiệp vụ
│   ├── Auth/
│   │   ├── Command/
│   │   └── Handler/
│   ├── Movie/
│   ├── Cinema/
│   ├── Showtime/
│   ├── Booking/
│   └── Payment/
│       ├── Command/                # InitiatePaymentCommand, ConfirmPaymentCommand, FailPaymentCommand
│       ├── Query/                  # GetPaymentQuery
│       └── Handler/                # InitiatePaymentHandler, ConfirmPaymentHandler, FailPaymentHandler, GetPaymentHandler
│
└── Infrastructure/                 # Tầng Infrastructure — kết nối ra ngoài
    ├── Config/
    │   ├── database.js
    │   ├── env.js
    │   ├── cloudinary.js           # Cloudinary + multer config
    │   └── container.js            # Dependency injection
    └── Http/
        ├── Controllers/
        │   └── UploadController.js
        ├── Middlewares/
        │   ├── authMiddleware.js
        │   ├── roleMiddleware.js
        │   └── errorMiddleware.js
        ├── Repositories/
        │   └── MySQLPaymentRepository.js
        └── Routes/
            ├── paymentRoutes.js
            └── uploadRoutes.js
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/auth/signUp` | — | Đăng ký tài khoản |
| POST | `/auth/signIn` | — | Đăng nhập, nhận JWT + refresh token |
| POST | `/auth/signOut` | ✅ | Đăng xuất (xóa refresh token) |
| POST | `/auth/refresh-token` | — | Làm mới access token |

**Request body — signIn:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response — signIn:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "refreshToken": "abc123...",
    "user": { "id": 1, "name": "Nam", "email": "user@example.com", "role": "user" }
  }
}
```

---

### Movies

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/movies` | — | Danh sách phim (filter: `genre`, `status`, `page`, `limit`) |
| GET | `/movies/:id` | — | Chi tiết phim |
| POST | `/movies` | 🔐 Admin | Thêm phim mới |
| PATCH | `/movies/:id` | 🔐 Admin | Cập nhật phim |
| DELETE | `/movies/:id` | 🔐 Admin | Xóa phim |

**Filter ví dụ:**
```
GET /movies?status=now_showing&genre=Hành+động&page=1&limit=10
```

**Status phim** (tính động từ `releaseDate`/`endDate`, không lưu DB):
- `coming_soon` — chưa đến ngày chiếu
- `now_showing` — đang chiếu
- `ended` — đã kết thúc

---

### Cinemas & Rooms

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/cinemas` | — | Danh sách rạp (filter: `city`) |
| GET | `/cinemas/:id` | — | Chi tiết rạp |
| POST | `/cinemas` | 🔐 Admin | Thêm rạp |
| PATCH | `/cinemas/:id` | 🔐 Admin | Cập nhật rạp |
| DELETE | `/cinemas/:id` | 🔐 Admin | Xóa rạp |
| GET | `/cinemas/:cinemaId/rooms` | — | Danh sách phòng của rạp |
| POST | `/cinemas/:cinemaId/rooms` | 🔐 Admin | Tạo phòng (tự sinh ghế theo grid) |
| GET | `/rooms/:id` | — | Chi tiết phòng |
| PATCH | `/rooms/:id` | 🔐 Admin | Cập nhật phòng |
| DELETE | `/rooms/:id` | 🔐 Admin | Xóa phòng |
| GET | `/rooms/:roomId/seats` | — | Sơ đồ ghế của phòng |
| PATCH | `/seats/:id` | 🔐 Admin | Cập nhật ghế (type, isActive) |

> Khi tạo phòng với `totalRows` và `seatsPerRow`, hệ thống tự động sinh toàn bộ ghế theo grid A1→ZN. Khi thay đổi kích thước phòng, ghế cũ bị xóa và sinh lại trong transaction.

---

### Showtimes

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/showtimes` | — | Danh sách suất chiếu (filter: `movieId`, `cinemaId`, `date`, `status`) |
| GET | `/showtimes/:id` | — | Chi tiết suất chiếu (kèm movie, room, cinema) |
| POST | `/showtimes` | 🔐 Admin | Tạo suất chiếu mới |
| PATCH | `/showtimes/:id/cancel` | 🔐 Admin | Hủy suất chiếu |

**Request body — tạo suất chiếu:**
```json
{
  "movieId": 1,
  "roomId": 2,
  "startTime": "2025-12-25T19:00:00.000Z",
  "basePrice": 90000,
  "vipPrice": 120000,
  "couplePrice": 200000
}
```

> `endTime` được tính tự động: `startTime + movie.duration + 15 phút buffer`. Client không truyền `endTime`.

**Status suất chiếu** (tính động):
- `SCHEDULED` — chưa bắt đầu
- `ONGOING` — đang chiếu
- `ENDED` — đã kết thúc
- `CANCELLED` — đã hủy

---

### Bookings

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/showtimes/:showtimeId/seats` | — | Sơ đồ ghế theo suất chiếu (kèm trạng thái + giá) |
| GET | `/bookings` | ✅ | Lịch sử đặt vé của user (filter: `status`) |
| GET | `/bookings/:id` | ✅ | Chi tiết booking (kèm showtime, movie, seats) |
| POST | `/bookings` | ✅ | Đặt vé — giữ ghế 10 phút |
| PATCH | `/bookings/:id/confirm` | ✅ | Xác nhận thanh toán trực tiếp |
| PATCH | `/bookings/:id/cancel` | ✅ | Hủy booking |

**Request body — đặt vé:**
```json
{
  "showtimeId": 5,
  "seatIds": [101, 102]
}
```

> Sau khi tạo booking, ghế được giữ trong **10 phút** (trạng thái `PENDING`). Nếu quá thời gian mà chưa confirm, ghế tự động trống lại — không cần cron job, xử lý trong query `findOccupiedSeatIdsByShowtimeId`.

**Seat status trong sơ đồ ghế:**
- `AVAILABLE` — trống, có thể chọn
- `OCCUPIED` — đã đặt hoặc đang được giữ bởi PENDING còn hạn
- `UNAVAILABLE` — ghế bị deactivate (hỏng)

---

### Payments

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/payments` | ✅ | Khởi tạo payment session cho booking |
| GET | `/payments/:id` | ✅ | Xem trạng thái payment |
| POST | `/payments/:id/confirm` | ✅ | Mock: giả lập thanh toán thành công |
| POST | `/payments/:id/fail` | ✅ | Mock: giả lập user hủy / cổng TT lỗi |

**Request body — khởi tạo payment:**
```json
{
  "bookingId": 10,
  "provider": "MOCK"
}
```

`provider` chấp nhận: `MOCK` | `VNPAY` | `MOMO`. Mặc định là `MOCK`.

**Response — khởi tạo payment:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "bookingId": 10,
    "amount": 180000,
    "status": "PENDING",
    "provider": "MOCK",
    "expiredAt": "2025-12-25T19:15:00.000Z",
    "paymentUrl": "/payments/3/mock-checkout",
    "instructions": "Gọi POST /payments/3/confirm để giả lập thanh toán thành công"
  }
}
```

**Payment status flow:**
```
PENDING → SUCCESS  (sau khi confirm)
PENDING → FAILED   (sau khi fail, hoặc hết hạn session 15 phút)
```

> Nếu booking đã có payment `PENDING` còn hạn, gọi lại `POST /payments` sẽ trả về session cũ thay vì tạo mới.

> Khi `confirm` thành công, cả **payment** (SUCCESS) và **booking** (CONFIRMED) được cập nhật trong cùng 1 database transaction để đảm bảo atomicity.

> Khi `fail`, booking vẫn giữ trạng thái `PENDING` — user có thể tạo payment session mới nếu booking chưa hết hold.

---

### Upload

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/upload/image` | 🔐 Admin | Upload ảnh lên Cloudinary |

**Request:** `multipart/form-data`, field name là `image`.

Chấp nhận: `JPG`, `PNG`, `WEBP`. Tối đa **5MB**.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/cinema-app/abc123.jpg",
    "publicId": "cinema-app/abc123"
  }
}
```

> URL trả về có thể dùng trực tiếp làm `posterUrl` khi tạo/cập nhật phim, hoặc `imageUrl` khi tạo/cập nhật rạp.

---

## Luồng nghiệp vụ chính

### Luồng đặt vé đầy đủ (với Payment)

```
1. User xem danh sách phim đang chiếu
   GET /movies?status=now_showing

2. Chọn phim → xem lịch chiếu theo ngày
   GET /showtimes?movieId=1&date=2025-12-25

3. Chọn suất chiếu → xem sơ đồ ghế còn trống + giá
   GET /showtimes/:showtimeId/seats

4. Chọn ghế → đặt vé (cần đăng nhập)
   POST /bookings  { showtimeId, seatIds }
   → Ghế được giữ 10 phút, status = PENDING

5. Khởi tạo payment session
   POST /payments  { bookingId, provider: "MOCK" }
   → Nhận paymentUrl

6. Thực hiện thanh toán (mock)
   POST /payments/:id/confirm
   → Payment: SUCCESS, Booking: CONFIRMED (trong 1 transaction)
```

### Luồng thanh toán thất bại / thử lại

```
1. POST /payments/:id/fail
   → Payment: FAILED, Booking vẫn PENDING (nếu còn trong hold)

2. Tạo lại payment session
   POST /payments  { bookingId }
   → Session mới với expiredAt mới

3. Thử thanh toán lại
   POST /payments/:id/confirm
```

### Luồng xác thực

```
1. Đăng nhập → nhận accessToken (15 phút) + refreshToken (30 ngày)
2. Mỗi request gửi kèm: Authorization: Bearer <accessToken>
3. Khi accessToken hết hạn → dùng refreshToken để lấy accessToken mới
   POST /auth/refresh-token  { refreshToken }
4. Đăng xuất → xóa refreshToken khỏi DB
   POST /auth/signOut  { refreshToken }
   # Hoặc đăng xuất tất cả thiết bị:
   POST /auth/signOut  { logoutAll: true }
```

### Luồng upload và gán ảnh

```
1. Admin upload ảnh
   POST /upload/image  (multipart/form-data, field: image)
   → Nhận url + publicId từ Cloudinary

2. Dùng url vào khi tạo/cập nhật phim
   POST /movies  { ..., posterUrl: "https://res.cloudinary.com/..." }

3. Hoặc dùng vào khi tạo/cập nhật rạp
   PATCH /cinemas/:id  { imageUrl: "https://res.cloudinary.com/..." }
```

---

## Database Schema

```sql
users (id, name, email, password_hash, role, created_at)
refresh_tokens (id, user_id, token, expires_at, created_at)

movies (id, title, duration, genres, directors, release_date, end_date,
        poster_url, description, age_rating, language, created_at)

cinemas (id, name, address, city, phone, image_url, created_at)
rooms   (id, cinema_id, name, type, total_rows, seats_per_row, created_at)
seats   (id, room_id, row, number, type, is_active, created_at)

showtimes (id, movie_id, room_id, start_time, end_time,
           base_price, vip_price, couple_price, cancelled_at, created_at)

bookings      (id, user_id, showtime_id, total_price, status,
               held_until, confirmed_at, cancelled_at, created_at)
booking_seats (id, booking_id, seat_id, seat_label, seat_type, price)

payments (id, booking_id, user_id, amount, status, provider,
          transaction_id, expired_at, paid_at, created_at)
```

Cascade deletes: `cinemas → rooms → seats`, `bookings → booking_seats`.

---

## Các quyết định thiết kế

**`endTime` không để client truyền vào** — tính server-side từ `movie.duration + 15 phút` để đảm bảo không có suất chiếu nào bị nhập sai thời lượng, và đảm bảo kiểm tra conflict lịch chính xác.

**`status` không lưu vào DB** — cả `Movie.status`, `Showtime.status`, `Payment.isExpired()` đều là computed getter tính từ timestamp. Không bao giờ bị stale, không cần cron job cập nhật.

**Giá vé snapshot tại thời điểm đặt** — `booking_seats.price` lưu giá tại lúc tạo booking, không reference ngược về `showtimes`. Admin đổi giá sau không ảnh hưởng booking cũ.

**Hold ghế không cần Redis hay cron** — `held_until` là timestamp trong DB. Query `findOccupiedSeatIdsByShowtimeId` chỉ tính ghế là "đang bị giữ" khi `status = 'PENDING' AND held_until > NOW()`. PENDING hết hạn tự động bị bỏ qua.

**Payment tách khỏi Booking** — 1 booking có thể có nhiều lần thử thanh toán (FAILED rồi thử lại). Payment lưu `transactionId` từ cổng TT để đối soát. Nếu sau này cần tích hợp VNPay/Momo thật, chỉ cần thêm IPN endpoint mới ở Infrastructure layer, không đụng Application layer.

**Payment + Booking update trong 1 transaction** — `ConfirmPaymentHandler` dùng `withTransaction` để đảm bảo atomicity: hoặc cả 2 đều SUCCESS/CONFIRMED, hoặc cả 2 rollback. Không có trạng thái lệch nhau.

**`PATCH /:id/cancel` thay vì `DELETE`** — soft delete để giữ audit trail. Booking và showtime đã hủy vẫn cần tham chiếu được từ lịch sử.

**Conflict lịch chiếu** — dùng overlap condition chuẩn: `startTime_mới < end_time_cũ AND endTime_mới > start_time_cũ`, chỉ kiểm tra suất chưa hủy (`cancelled_at IS NULL`).
