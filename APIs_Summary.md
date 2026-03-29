# BookStore Website — APIs Summary

## Base URL
```
http://127.0.0.1:8000/api/
```
Frontend gọi API qua Axios instance (`FE/src/apis/api.tsx`), base URL có thể cấu hình qua biến môi trường `VITE_API_BASE_URL`.

---

## Pagination (Cursor-based)
Các endpoint có phân trang đều trả về cùng format:
```json
{
  "next": "http://...?cursor=...",
  "previous": "http://...?cursor=...",
  "results": [...]
}
```

---

## 1. BOOKS (`/api/books/`)

### GET `/api/books/`
Lấy danh sách sách (cursor pagination, 30/trang).

| Tham số | Loại | Mô tả |
|---|---|---|
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list
```json
{ "bookId": "", "title": "", "author": "", "price": 0.00, "coverImg": "", "quantity": 0 }
```

---

### GET `/api/books/filter/`
Lọc sách theo điều kiện (cursor pagination, 20/trang).

| Tham số | Loại | Mô tả |
|---|---|---|
| `min_price` | query (optional) | Giá tối thiểu |
| `max_price` | query (optional) | Giá tối đa |
| `language` | query (optional) | Ngôn ngữ (case-insensitive, contains) |
| `genre` | query (optional) | Thể loại (case-insensitive, contains) |
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list (format giống `/api/books/`)

---

### GET `/api/books/search/`
Tìm kiếm sách theo tên (cursor pagination, 30/trang).

| Tham số | Loại | Mô tả |
|---|---|---|
| `title` | query (**required**) | Từ khóa tìm kiếm (case-insensitive, contains) |
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list (format giống `/api/books/`)

---

### GET `/api/books/book-info/`
Lấy thông tin chi tiết của 1 cuốn sách.

| Tham số | Loại | Mô tả |
|---|---|---|
| `bookId` | query (**required**) | ID của sách |

**Response (200):**
```json
{
  "bookId": "", "title": "", "series": "", "author": "", "description": "",
  "language": "", "isbn": "", "genres": "", "characters": "", "bookFormat": "",
  "edition": "", "pages": 0, "publishDate": "YYYY-MM-DD", "awards": "",
  "coverImg": "", "price": 0.00, "quantity": 0
}
```

---

### GET `/api/books/recommend/`
Lấy 3 cuốn sách ngẫu nhiên để gợi ý.

**Response (200):** array gồm 3 phần tử
```json
[{ "bookId": "", "title": "", "author": "", "price": 0.00, "coverImg": "", "quantity": 0 }]
```

---

### GET `/api/books/statistics/`
Thống kê tổng quan về kho sách.

**Response (200):**
```json
{
  "total_books": 0,
  "total_quantity": 0,
  "total_value": 0.0,
  "books_by_genre":     [{ "genres": "", "count": 0 }],
  "books_by_language":  [{ "language": "", "count": 0 }],
  "books_by_publisher": [{ "publisher": "", "count": 0 }],
  "books_by_author":    [{ "author": "", "count": 0 }],
  "books_by_format":    [{ "bookFormat": "", "count": 0 }]
}
```
> Mỗi mục chỉ giữ top 10, phần còn lại gộp vào `"Other"`.

---

### POST `/api/books/create/`
Tạo mới 1 cuốn sách (Admin).

**Request body (JSON):**
```json
{
  "bookId": "", "title": "", "series": "", "author": "", "description": "",
  "language": "", "isbn": "", "genres": "", "characters": "", "bookFormat": "",
  "edition": "", "pages": 0, "publishDate": "YYYY-MM-DD", "awards": "",
  "coverImg": "", "price": 0.00, "quantity": 0
}
```

**Response (201):** `{ "message": "Book created successfully" }`
**Response (400):** `{ "error": { ... } }` (validation errors)

---

### PATCH `/api/books/update/`
Cập nhật thông tin sách (partial update, Admin).

| Tham số | Loại | Mô tả |
|---|---|---|
| `bookId` | query (**required**) | ID của sách cần cập nhật |

**Request body (JSON):** bất kỳ field nào trong BookDetail cần thay đổi.

**Response (200):** `{ "message": "Book updated successfully" }`

---

### DELETE `/api/books/delete/`
Xóa 1 cuốn sách (Admin).

| Tham số | Loại | Mô tả |
|---|---|---|
| `book_id` | query (**required**) | ID của sách cần xóa |

**Response (200):** `{ "message": "Book deleted successfully" }`

---

## 2. ACCOUNTS — Authentication (`/api/token/`)

### POST `/api/token/`
Đăng nhập — lấy JWT access token & refresh token.

**Request body (JSON):**
```json
{ "username": "john_doe_or_email@example.com", "password": "..." }
```

**Response (200):**
```json
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "username": "", "email": "", "fullname": "",
    "phonenumber": "", "address": "", "role": "user|admin"
  }
}
```
> JWT payload có custom claims: `username`, `role`, `email`, `fullname`.

---

### POST `/api/token/refresh/`
Lấy access token mới bằng refresh token.

**Request body (JSON):**
```json
{ "refresh": "eyJ..." }
```

**Response (200):**
```json
{ "access": "eyJ...", "refresh": "eyJ..." }
```

---

### POST `/api/token/blacklist/`
Đăng xuất — vô hiệu hóa refresh token.

**Request body (JSON):**
```json
{ "refresh": "eyJ..." }
```

**Response (200):** `{ "message": "Token blacklisted successfully" }`

---

## 3. ACCOUNTS — User-facing (`/api/accounts/`)

### POST `/api/accounts/create/`
Đăng ký tài khoản mới.

**Request body (JSON):**
```json
{
  "username": "", "password": "", "email": "",
  "fullname": "", "phonenumber": "", "address": "", "role": "user"
}
```

**Response (201):** `{ "message": "Account created successfully" }`
**Response (400):** `{ "error": "Username/Email/Phone number already exists" }`

---

### POST `/api/accounts/login/`
*(Legacy)* Đăng nhập không dùng JWT — trả về thông tin user.

**Request body (JSON):**
```json
{ "username": "username_or_email", "password": "..." }
```

**Response (200):**
```json
{ "username": "", "fullname": "", "email": "", "phonenumber": "", "address": "", "role": "" }
```

---

### PATCH `/api/accounts/edit/`
Chỉnh sửa thông tin tài khoản (partial update).

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của tài khoản |

**Request body (JSON):** các field cần thay đổi (`fullname`, `email`, `phonenumber`, `address`, `password`).

**Response (200):** `{ "message": "Account updated successfully" }`

---

### DELETE `/api/accounts/delete/`
Xóa tài khoản.

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của tài khoản cần xóa |

**Response (204):** `{ "message": "Account deleted successfully" }`

---

## 4. ACCOUNTS — Admin (`/api/admin/accounts/`)

### GET `/api/admin/accounts/`
Lấy danh sách tất cả tài khoản (cursor pagination, 10/trang, order by username).

| Tham số | Loại | Mô tả |
|---|---|---|
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list
```json
{ "username": "", "email": "", "fullname": "", "phonenumber": "", "address": "", "role": "" }
```

---

### POST `/api/admin/accounts/create/`
Tạo tài khoản mới (Admin — dùng serializer).

**Request body:** giống `/api/accounts/create/`

**Response (201):** `{ "message": "Account created successfully" }`

---

### PATCH `/api/admin/accounts/update/`
Cập nhật tài khoản bất kỳ (Admin, partial update).

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của tài khoản |

**Request body (JSON):** các field cần thay đổi.

**Response (200):** `{ "message": "Account updated successfully" }`

---

### GET `/api/admin/accounts/search/`
Tìm kiếm tài khoản (tìm trong username, email, phonenumber, fullname — cursor pagination, 10/trang).

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (optional) | Từ khóa tìm kiếm |
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list (format giống `/api/admin/accounts/`)

---

### GET `/api/admin/accounts/account-info/`
Xem chi tiết 1 tài khoản.

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của tài khoản |

**Response (200):**
```json
{ "username": "", "email": "", "fullname": "", "phonenumber": "", "address": "", "role": "" }
```

---

### DELETE `/api/admin/accounts/delete/`
Xóa tài khoản bất kỳ (Admin).

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username cần xóa |

**Response (204):** `{ "message": "Account deleted successfully" }`

---

## 5. CARTS (`/api/cart/`)

### POST `/api/cart/add/`
Thêm sách vào giỏ hàng (nếu sách đã có thì cộng thêm số lượng).

**Request body (JSON):**
```json
{ "username": "", "bookId": "", "quantity": 1 }
```

**Response (201):** `{ "message": "Book added to cart successfully" }`

---

### PUT `/api/cart/edit/`
Cập nhật số lượng 1 item trong giỏ.

| Tham số | Loại | Mô tả |
|---|---|---|
| `cartId` | query (**required**) | ID của cart item |

**Request body (JSON):**
```json
{ "quantity": 2 }
```

**Response (200):** `{ "message": "Cart updated successfully." }`

---

### DELETE `/api/cart/delete/`
Xóa 1 item khỏi giỏ hàng.

| Tham số | Loại | Mô tả |
|---|---|---|
| `cartId` | query (**required**) | ID của cart item |

**Response (200):** `{ "message": "Book removed from cart successfully.", "cartId": "" }`

---

### GET `/api/cart/load/`
Lấy toàn bộ giỏ hàng của 1 user.

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của user |

**Response (200):**
```json
[
  {
    "cartId": 0,
    "book": { "bookId": "", "title": "", "author": "", "price": 0.00, "coverImg": "", "quantity": 0 },
    "quantity": 0,
    "added_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## 6. ORDERS (`/api/orders/`)

### GET `/api/orders/`
Lấy tất cả đơn hàng của 1 user (kèm chi tiết từng item).

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của user |

**Response (200):**
```json
[
  {
    "orderId": 0, "username": "", "receiverName": "", "receiverPhone": "",
    "orderDate": "", "status": "Processing", "totalAmount": 0.00,
    "shippingAddress": "", "paymentMethod": "", "createdAt": "", "updatedAt": "",
    "items": [
      { "orderItemId": 0, "bookId": "", "quantity": 0, "price": 0.00, "totalPrice": 0.00, "coverImg": "" }
    ]
  }
]
```

---

### POST `/api/orders/create/`
Tạo đơn hàng mới (tự động trừ tồn kho sách).

**Request body (JSON):**
```json
{
  "username": "",
  "receiverName": "",
  "receiverPhone": "",
  "shippingAddress": "",
  "paymentMethod": "Credit Card | PayPal | Cash on Delivery",
  "items": [
    { "book_id": "", "quantity": 0, "price": 0.00 }
  ]
}
```

**Response (201):** `{ "message": "Order created successfully!" }`
**Response (400):** `{ "error": "Not enough stock for '...'." }` (khi thiếu hàng)

---

### PATCH `/api/orders/edit/`
Chỉnh sửa đơn hàng (Admin, partial update).

| Tham số | Loại | Mô tả |
|---|---|---|
| `order_id` | query (**required**) | ID của đơn hàng |

**Request body (JSON):** các field cần cập nhật.

**Response (200):** dữ liệu đơn hàng đã cập nhật (full order object).

---

### PUT `/api/orders/status/`
Hủy đơn hàng (User — chỉ hủy được khi status là `"Processing"`).

| Tham số | Loại | Mô tả |
|---|---|---|
| `username` | query (**required**) | Username của user |
| `order_id` | query (**required**) | ID của đơn hàng |

**Response (200):** `{ "message": "Order cancelled successfully" }`
**Response (400):** `{ "error": "Only orders in 'Processing' status can be cancelled" }`

---

### DELETE `/api/orders/delete/`
Xóa đơn hàng (Admin).

| Tham số | Loại | Mô tả |
|---|---|---|
| `order_id` | query (**required**) | ID của đơn hàng |

**Response (204):** `{ "message": "Order deleted successfully" }`

---

### GET `/api/orders/list/`
Lấy danh sách tóm tắt tất cả đơn hàng (Admin, cursor pagination, 10/trang).

| Tham số | Loại | Mô tả |
|---|---|---|
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list
```json
{ "orderId": 0, "username": "", "totalAmount": 0.00, "status": "" }
```

---

### GET `/api/orders/search/`
Tìm kiếm đơn hàng theo orderId (exact) hoặc username (partial) (Admin, cursor pagination, 10/trang).

| Tham số | Loại | Mô tả |
|---|---|---|
| `order_id` | query (**required**) | Từ khóa tìm kiếm (orderId hoặc username) |
| `cursor` | query (optional) | Con trỏ phân trang |

**Response:** paginated list (full order + items, format giống `/api/orders/`)

---

### GET `/api/orders/details/`
Xem chi tiết 1 đơn hàng (Admin — không kèm items).

| Tham số | Loại | Mô tả |
|---|---|---|
| `order_id` | query (**required**) | ID của đơn hàng |

**Response (200):**
```json
{
  "orderId": 0, "username": "", "receiverName": "", "receiverPhone": "",
  "orderDate": "", "status": "", "totalAmount": 0.00,
  "shippingAddress": "", "paymentMethod": "", "createdAt": "", "updatedAt": ""
}
```

---

## Reference: Enum Values

| Trường | Giá trị hợp lệ |
|---|---|
| `order.status` | `Processing`, `Shipping`, `Delivered`, `Cancelled` |
| `order.paymentMethod` | `Credit Card`, `PayPal`, `Cash on Delivery` |
| `account.role` | `user`, `admin` |

---

## Reference: Data Models

### Book
| Field | Type |
|---|---|
| `bookId` | string (PK) |
| `title` | string |
| `author` | text |
| `series` | string |
| `description` | text |
| `language` | string |
| `isbn` | string |
| `genres` | string |
| `characters` | text |
| `bookFormat` | string |
| `edition` | string |
| `pages` | integer |
| `publishDate` | date |
| `awards` | text |
| `coverImg` | text (URL) |
| `price` | decimal |
| `quantity` | integer |
| `setting` | text |
| `publisher` | string |

### Account
| Field | Type | Note |
|---|---|---|
| `username` | string (PK) | |
| `password` | string | write-only, hashed |
| `email` | string | unique |
| `fullname` | string | |
| `phonenumber` | string | |
| `address` | text | |
| `role` | string | `user` \| `admin` |

### Cart
| Field | Type |
|---|---|
| `cartId` | int (auto PK) |
| `username` | FK → Account |
| `bookId` | FK → Book |
| `quantity` | integer |
| `added_at` | datetime |

### Order
| Field | Type |
|---|---|
| `orderId` | int (auto PK) |
| `username` | string |
| `receiverName` | string |
| `receiverPhone` | string |
| `orderDate` | datetime |
| `status` | string |
| `totalAmount` | decimal |
| `shippingAddress` | text |
| `paymentMethod` | string |
| `createdAt` | datetime |
| `updatedAt` | datetime |

### OrderItem
| Field | Type |
|---|---|
| `orderItemId` | int (auto PK) |
| `orderId` | FK → Order |
| `bookId` | FK → Book |
| `quantity` | integer |
| `price` | decimal |
| `totalPrice` | decimal |
