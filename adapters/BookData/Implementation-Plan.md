# Book Data Adapter — Implementation Plan

## 1. Identity

- Adapter: `BookDataAdapter`
- Capability: `BookDataSource`
- Contract: `contracts/book-data-source.v1.json`
- Interface: `adapters/BookData/Adapter-Interface.json`
- Consumer: `SBBox-BookCatalog`

## 2. Purpose

BookDataAdapter cung cấp logical Book data cho
`SBBox-BookCatalog`.

Adapter thực hiện HOW dữ liệu Book được đọc từ nguồn dữ liệu.

## 3. Data Source

Nguồn dữ liệu ban đầu là:

    public/data/book.json

Đây là Static Book Data Resource.

Adapter chịu trách nhiệm đọc và chuyển đổi nguồn dữ liệu
thành logical Book data phù hợp với BookCatalog.

## 4. Data Flow

    public/data/book.json
            │
            ▼
    BookDataAdapter
            │
            │ getBook(book_id)
            ▼
    BookCatalogDataSource
            │
            ▼
    SBBox-BookCatalog

## 5. Interface Implementation

BookDataAdapter phải implement:

    BookCatalogDataSource

với operation:

    getBook(book_id)

Operation phải trả về:

    Book | undefined

hoặc cơ chế tương đương phù hợp với abstraction của
BookCatalogDataSource.

## 6. Book Resolution

`getBook(book_id)` phải:

1. nhận stable `book_id`;
2. đọc Book Data Resource;
3. tìm Book có `book_id` tương ứng;
4. validate Book;
5. trả về logical Book.

Nếu Book không tồn tại:

    BOOK_NOT_FOUND

## 7. Data Parsing

Adapter phải đọc dữ liệu từ:

    public/data/book.json

và parse thành logical Book data.

Parsing logic thuộc Adapter.

SBBox-BookCatalog không được biết:

- JSON;
- file format;
- filesystem;
- URL;
- fetch mechanism;
- parsing mechanism.

## 8. Validation

Adapter phải kiểm tra tối thiểu:

### Book

- `book_id` tồn tại;
- `title` là string;
- `cover` tồn tại;
- `cover.image` là string;
- `pages` là array.

### Page

Mỗi page phải có:

- `page_id`;
- `order`;
- `image`;
- `narration_id`.

Nếu dữ liệu không phù hợp:

    BOOK_DATA_INVALID

## 9. Stable Identifiers

Adapter phải bảo toàn:

- `book_id`;
- `page_id`;
- `narration_id`.

Không được thay thế bằng:

- filename;
- array index;
- provider ID;
- database ID.

## 10. Narration Boundary

Adapter chỉ cung cấp:

    narration_id

Ví dụ:

    audio-01

Adapter tuyệt đối không:

- resolve Vocaroo URL;
- import Vocaroo;
- play audio;
- pause audio;
- stop audio;
- quản lý playback state.

## 11. Image Boundary

Adapter chỉ cung cấp logical image reference:

    cover.png
    page-01.png

Adapter không:

- render image;
- manipulate DOM;
- create HTML;
- load image into UI.

## 12. No Business Logic

Adapter không được implement:

- next page;
- previous page;
- current page;
- navigation boundaries;
- reading progress;
- session management;
- narration playback;
- user interface.

## 13. Technology Boundary

Technology-specific implementation phải nằm bên trong
BookDataAdapter.

SBBox-BookCatalog không được phụ thuộc trực tiếp vào:

- filesystem;
- browser;
- LocalStorage;
- Supabase;
- PostgreSQL;
- Vocaroo;
- React;
- Vite.

## 14. Error Mapping

Adapter phải bảo đảm các lỗi phù hợp với
`book-data-source.v1.json`.

### BOOK_NOT_FOUND

Book được yêu cầu không tồn tại.

### BOOK_DATA_INVALID

Book tồn tại nhưng dữ liệu không phù hợp với logical
Book model.

## 15. No Silent Mutation

Adapter không được tự ý sửa dữ liệu nguồn để biến dữ liệu
không hợp lệ thành hợp lệ.

Dữ liệu sai phải được báo cáo:

    BOOK_DATA_INVALID

## 16. Dependency Direction

Dependency direction phải là:

    SBBox-BookCatalog
            │
            ▼
    BookCatalogDataSource
            ▲
            │
    BookDataAdapter
            │
            ▼
    Book Data Resource

Adapter phục vụ abstraction.

Adapter không trở thành dependency của domain logic.

## 17. Implementation File

Implementation chính dự kiến:

    adapters/BookData/box.ts

File này chỉ chứa logic của BookDataAdapter.

Không đưa logic của các Smart Box khác vào file này.

## 18. Verification Plan

Sau implementation phải kiểm tra:

### Contract

    contracts/book-data-source.v1.json

### Interface

    adapters/BookData/Adapter-Interface.json

### Knowledge

    adapters/BookData/Knowledge.md

### Rules

    adapters/BookData/Rules.md

### Data

    public/data/book.json

### Integration Boundary

Đảm bảo:

    SBBox-BookCatalog
            │
            ▼
    BookCatalogDataSource
            ▲
            │
    BookDataAdapter

không có dependency trực tiếp từ Smart Box tới
technology-specific data source.

## 19. Verification Cases

Phải kiểm tra tối thiểu:

1. Resolve đúng `educational-audiobook-001`.
2. Trả về đúng title.
3. Trả về đúng cover.
4. Trả về đúng 10 pages.
5. Bảo toàn page IDs.
6. Bảo toàn page order.
7. Bảo toàn image references.
8. Bảo toàn narration IDs.
9. Book không tồn tại → `BOOK_NOT_FOUND`.
10. Dữ liệu không hợp lệ → `BOOK_DATA_INVALID`.
11. Không xuất hiện Vocaroo URL.
12. Không có navigation logic.
13. Không có playback logic.
14. Không có UI logic.

## 20. Final Architectural Principle

BookDataAdapter owns HOW Book data is accessed.

BookDataSource defines WHAT data is provided.

SBBox-BookCatalog depends only on WHAT.

The Adapter must remain replaceable without changing
the BookCatalog capability or its Smart Box.

The implementation must preserve the architectural boundary.
