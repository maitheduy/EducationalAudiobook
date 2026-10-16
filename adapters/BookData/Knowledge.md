# Book Data Adapter — Knowledge

## 1. Identity

- Adapter: `BookDataAdapter`
- Capability: `BookDataSource`
- Contract: `contracts/book-data-source.v1.json`
- Interface: `adapters/BookData/Adapter-Interface.json`

## 2. Purpose

Book Data Adapter cung cấp dữ liệu logic của Book cho
`SBBox-BookCatalog`.

Adapter trả lời câu hỏi:

> HOW is Book data accessed?

Adapter không quyết định:

> WHAT does BookCatalog do with the Book?

## 3. Relationship with SBBox-BookCatalog

Luồng phụ thuộc:

    SBBox-BookCatalog
            │
            │ BookCatalogDataSource
            ▼
      BookDataAdapter
            │
            ▼
        Book Data

`SBBox-BookCatalog` không biết technology cụ thể được sử dụng
để lấy Book data.

## 4. Book Data

Book data phải cung cấp tối thiểu:

- `book_id`
- `title`
- `cover`
- `pages`

Mỗi page phải có:

- `page_id`
- `order`
- `image`
- `narration_id`

Book data phải phù hợp với logical Book model của
`BookCatalog`.

## 5. Stable Identifier

Adapter phải bảo toàn stable identifiers:

- `book_id`
- `page_id`
- `narration_id`

Adapter không được tự ý thay đổi hoặc tạo lại các identifier
này trong quá trình cung cấp dữ liệu.

## 6. Adapter Boundary

Adapter chịu trách nhiệm về:

- truy cập nguồn dữ liệu;
- đọc dữ liệu;
- phân giải Book theo `book_id`;
- chuyển dữ liệu nguồn thành logical Book data;
- xử lý lỗi của nguồn dữ liệu.

Adapter không chịu trách nhiệm về:

- page navigation;
- narration playback;
- Vocaroo;
- image rendering;
- reading session;
- user interface.

## 7. Technology Independence of the Contract

Contract không yêu cầu một technology cụ thể.

Book data trong tương lai có thể đến từ:

- static resource;
- JSON;
- API;
- database;
- cloud service;
- một nguồn dữ liệu khác.

Technology-specific implementation phải được giữ bên trong
Adapter.

## 8. WHAT and HOW

Smart Box hỏi:

> Give me the Book identified by `book_id`.

Adapter quyết định:

> HOW the Book is obtained.

Đây là ranh giới:

    WHAT
      │
      ▼
BookDataSource Contract
      ▲
      │
      │ HOW
      │
BookDataAdapter

## 9. Error Knowledge

Adapter có hai lỗi được định nghĩa trong Contract:

### BOOK_NOT_FOUND

Book được yêu cầu không tồn tại trong nguồn dữ liệu.

### BOOK_DATA_INVALID

Dữ liệu Book tồn tại nhưng không phù hợp với logical Book model.

## 10. Architectural Principle

Book Data Adapter là cầu nối giữa:

    Logical Book Model

và

    Technology-specific Data Source

Adapter làm nhiệm vụ thích nghi, không làm thay đổi
business meaning của Book.

## 11. Summary

Book Data Adapter:

- cung cấp Book;
- nhận stable `book_id`;
- thực hiện HOW;
- giữ technology-specific logic;
- bảo toàn stable identifiers;
- không điều khiển navigation;
- không điều khiển narration;
- không render image;
- không quản lý ReadingSession.

Nguyên tắc cốt lõi:

> Adapter owns HOW.  
> Smart Box depends on WHAT.
