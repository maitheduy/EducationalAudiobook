# SBBox-BookCatalog Specification

## 1. Identity

- Smart Box: `SBBox-BookCatalog`
- Version: `1.0.0`
- Capability: `BookCatalog`
- Contract: `contracts/book-catalog.v1.json`

## 2. Purpose

`SBBox-BookCatalog` cung cấp cấu trúc logic của cuốn sách giáo dục.

Box cho phép các capability khác biết:

- cuốn sách là gì;
- cuốn sách có những trang nào;
- thứ tự logic của các trang;
- ảnh nào được tham chiếu bởi mỗi trang;
- narration nào được liên kết với mỗi trang.

Box chỉ cung cấp thông tin và capability được định nghĩa bởi Contract.

## 3. Responsibility

`SBBox-BookCatalog` chịu trách nhiệm:

1. Nhận diện cuốn sách bằng `book_id` được cung cấp ở cấp Smart Box Context.
2. Cung cấp metadata của cuốn sách.
3. Cung cấp tham chiếu tới cover.
4. Cung cấp danh sách các trang theo thứ tự đọc.
5. Truy xuất một trang theo `page_id`.
6. Cung cấp `narration_id` được liên kết với một trang.

## 4. Logical Model

Cấu trúc logic của sách:

    Book
    ├── Cover
    │   └── image reference
    │
    └── Pages
        ├── Page
        │   ├── page_id
        │   ├── order
        │   ├── image reference
        │   └── narration_id
        │
        ├── Page
        └── ...

Cover và các trang là các thành phần logic của BookCatalog.

## 5. Operations

### 5.1 loadBook

Mục đích:

Nạp cấu trúc logic của cuốn sách được xác định bởi `book_id` trong Smart Box Context.

Input:

- Không có tham số operation.
- `book_id` được lấy từ Smart Box Context.

Output:

- Một `book`.

### 5.2 getBookMetadata

Mục đích:

Cung cấp metadata của cuốn sách được xác định bởi `book_id` trong Smart Box Context.

Input:

- Không có tham số operation.
- `book_id` được lấy từ Smart Box Context.

Output:

- Metadata của book.

### 5.3 getCover

Mục đích:

Cung cấp tham chiếu tới cover của cuốn sách được xác định bởi `book_id` trong Smart Box Context.

Input:

- Không có tham số operation.
- `book_id` được lấy từ Smart Box Context.

Output:

- `image` reference.

### 5.4 listPages

Mục đích:

Cung cấp toàn bộ các trang của cuốn sách theo thứ tự đọc logic.

Input:

- Không có tham số operation.
- `book_id` được lấy từ Smart Box Context.

Output:

- Danh sách `page`.

### 5.5 getPage

Mục đích:

Truy xuất một trang bằng `page_id` trong cuốn sách được xác định bởi `book_id` trong Smart Box Context.

Input:

- `page_id`.

Output:

- `page`.

### 5.6 resolvePageNarration

Mục đích:

Lấy `narration_id` được liên kết với một trang trong cuốn sách được xác định bởi `book_id` trong Smart Box Context.

Input:

- `page_id`.

Output:

- Stable `narration_id`.

## 6. Ownership

BookCatalog owns:

- Book identity
- Book metadata
- Cover reference
- Ordered page structure
- Page identity
- Page image reference
- Page-to-narration relationship

BookCatalog does not own:

- Image rendering
- Image loading technology
- Narration playback
- Narration provider
- Browser APIs
- User interface
- Persistence technology

## 7. Stable Identifiers

BookCatalog sử dụng stable identifiers cho:

- book
- page
- narration

Các identifier này được sử dụng để kết nối các capability mà không phụ thuộc vào technology hoặc provider cụ thể.

### 7.1 Book Context

`book_id` được cung cấp ở cấp Smart Box Context của `SBBox-BookCatalog`.

Các operation của `SBBox-BookCatalog` không yêu cầu truyền lại `book_id` trong từng operation.

Do đó:

- `loadBook()` sử dụng `book_id` từ Box Context.
- `getBookMetadata()` sử dụng `book_id` từ Box Context.
- `getCover()` sử dụng `book_id` từ Box Context.
- `listPages()` sử dụng `book_id` từ Box Context.
- `getPage(page_id)` sử dụng `book_id` từ Box Context và `page_id` được cung cấp bởi operation.
- `resolvePageNarration(page_id)` sử dụng `book_id` từ Box Context và `page_id` được cung cấp bởi operation.

`book_id` là context của Smart Box, không phải capability mới và không làm thay đổi trách nhiệm của BookCatalog.

## 8. Boundary

BookCatalog chỉ chịu trách nhiệm về cấu trúc logic của sách.

BookCatalog không:

- phát audio;
- điều khiển audio;
- truy cập trực tiếp Vocaroo;
- render ảnh;
- điều khiển browser;
- điều khiển giao diện người dùng;
- quản lý persistence technology.

## 9. Dependency Principle

BookCatalog không phụ thuộc vào capability khác.

BookCatalog chỉ phụ thuộc vào Contract của chính capability:

`contracts/book-catalog.v1.json`

`book_id` được cung cấp thông qua Smart Box Context và không tạo ra một capability dependency mới.

## 10. Technology Independence

Specification này không yêu cầu:

- JavaScript
- TypeScript
- React
- Vite
- Browser API
- LocalStorage
- Supabase
- Vocaroo API
- database

Các công nghệ cụ thể chỉ được giới thiệu ở Adapter Layer khi cần thiết.

## 11. Architectural Principle

`SBBox-BookCatalog` follows:

> Depend on WHAT, Never HOW.

Box mô tả WHAT của cấu trúc sách và không quyết định HOW tài nguyên được lưu trữ, tải hoặc hiển thị.

## 12. Contract Compliance

Implementation của `SBBox-BookCatalog` phải tuân thủ:

`contracts/book-catalog.v1.json`

Không được tự ý thêm capability làm thay đổi trách nhiệm của Box nếu chưa cập nhật Contract và kiến trúc tương ứng.

## 13. Implementation Boundary

Implementation chưa được định nghĩa trong Specification này.

Mọi quyết định về:

- ngôn ngữ lập trình;
- framework;
- storage;
- browser;
- asset loading;

phải được thực hiện ở các tầng thích hợp và không được làm thay đổi trách nhiệm của Smart Box.

## 14. Verification Intent

Một implementation đạt yêu cầu khi:

1. Cung cấp đúng các operation trong Contract.
2. Sử dụng đúng `book_id` từ Smart Box Context.
3. Trả về pages đúng logical order.
4. Duy trì stable identifiers.
5. Không phụ thuộc trực tiếp vào Vocaroo.
6. Không chứa logic rendering.
7. Không chứa logic playback.
8. Không chứa technology-specific dependency trong Smart Box.
9. Không vi phạm ownership boundary.
10. Không tự ý mở rộng capability ngoài Contract.
