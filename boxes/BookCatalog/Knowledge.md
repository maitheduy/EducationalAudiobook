# SBBox-BookCatalog Knowledge

## 1. Identity

- Smart Box: `SBBox-BookCatalog`
- Capability: `BookCatalog`
- Version: `1.0.0`
- Contract: `contracts/book-catalog.v1.json`
- Specification: `boxes/BookCatalog/SBBox-Specification.md`

## 2. Knowledge Purpose

Tài liệu này mô tả tri thức cần thiết để hiểu và sử dụng
`SBBox-BookCatalog`.

Knowledge tập trung vào:

- khái niệm Book;
- cấu trúc Cover và Pages;
- stable identifiers;
- quan hệ giữa Page và Narration;
- Smart Box Context;
- ownership boundary;
- quan hệ giữa BookCatalog và các capability khác.

Knowledge không mô tả implementation technology cụ thể.

## 3. Book Concept

Trong hệ thống EducationalAudiobook, một Book là một cấu trúc
logic gồm:

- Book identity;
- Book metadata;
- Cover;
- danh sách Pages theo thứ tự đọc.

Mô hình logic:

    Book
    │
    ├── Cover
    │
    └── Pages
        │
        ├── Page 01
        ├── Page 02
        ├── Page 03
        └── ...

BookCatalog chịu trách nhiệm mô tả cấu trúc logic này.

## 4. Cover

Cover là thành phần giới thiệu của Book.

Cover có:

- image reference.

Cover không bắt buộc phải có narration.

BookCatalog chỉ cung cấp reference của Cover.

BookCatalog không chịu trách nhiệm:

- render Cover;
- tải Cover bằng browser API;
- hiển thị Cover;
- xử lý giao diện.

## 5. Page

Mỗi Page là một đơn vị nội dung logic của Book.

Một Page có:

- `page_id`;
- `order`;
- `image`;
- `narration_id`.

Trong đó:

`page_id`

là stable identifier của Page.

`order`

xác định vị trí logic của Page trong Book.

`image`

là reference tới hình ảnh của Page.

`narration_id`

là stable identifier của narration được liên kết với Page.

## 6. Page Order

Các Page phải được cung cấp theo logical reading order.

BookCatalog là nơi xác định:

> Page nào đứng trước và Page nào đứng sau trong cấu trúc logic của Book.

BookCatalog không thực hiện việc chuyển trang.

Việc chuyển trang thuộc capability `Navigation`.

## 7. Stable Identifier

Hệ thống sử dụng stable identifiers để kết nối các capability.

Các loại identifier chính:

- `book_id`
- `page_id`
- `narration_id`

Các identifier này không được gắn chặt với:

- browser;
- framework;
- storage;
- hosting provider;
- narration provider.

Mục đích của stable identifier là cho phép các capability giao tiếp
với nhau mà không cần biết implementation của nhau.

## 8. Book Context

`book_id` được cung cấp ở cấp Smart Box Context của
`SBBox-BookCatalog`.

Do đó các operation của BookCatalog không cần truyền lại
`book_id` trong từng operation.

Ví dụ:

    SBBox-BookCatalog
    │
    ├── Context
    │   └── book_id
    │
    ├── loadBook()
    ├── getBookMetadata()
    ├── getCover()
    ├── listPages()
    ├── getPage(page_id)
    └── resolvePageNarration(page_id)

Các operation sử dụng cùng Book Context.

## 9. Page and Narration Relationship

BookCatalog biết:

> Page nào được liên kết với narration nào.

BookCatalog chỉ cung cấp:

`page_id → narration_id`

BookCatalog không biết narration được cung cấp bởi:

- Vocaroo;
- một audio server;
- một file local;
- một cloud provider;
- hay một provider khác.

Việc biến `narration_id` thành narration resource thuộc
capability `Narration` và Adapter tương ứng.

## 10. Relationship with Narration

Quan hệ logic:

    BookCatalog
         │
         │ narration_id
         ▼
    Narration
         │
         │ narration resource
         ▼
    Narration Adapter

BookCatalog chỉ chịu trách nhiệm tạo ra mối liên hệ logic giữa
Page và narration.

BookCatalog không điều khiển:

- play;
- pause;
- stop;
- narration state.

Các trách nhiệm này thuộc `SBBox-Narration`.

## 11. Relationship with Navigation

Quan hệ logic:

    BookCatalog
         │
         │ ordered pages
         ▼
    Navigation
         │
         │ current position
         ▼
    Reading Session

BookCatalog cung cấp page order.

Navigation sử dụng page order để thực hiện:

- current page;
- next page;
- previous page;
- go to page;
- boundary checking.

BookCatalog không thực hiện navigation.

## 12. Relationship with ReadingSession

ReadingSession cần biết cấu trúc logic của Book để theo dõi:

- current page;
- current position;
- total pages;
- progress.

BookCatalog cung cấp cấu trúc Book.

ReadingSession sử dụng cấu trúc đó nhưng không sở hữu cấu trúc Book.

## 13. Relationship with Image Adapter

BookCatalog chỉ biết:

`image reference`

BookCatalog không biết HOW image được tải.

Mô hình:

    BookCatalog
         │
         │ image reference
         ▼
    Image Adapter
         │
         ▼
    Image Resource

Image Adapter chịu trách nhiệm technology-specific image loading.

## 14. Technology Independence

BookCatalog phải có khả năng tồn tại độc lập với:

- JavaScript;
- TypeScript;
- React;
- Vite;
- Browser API;
- LocalStorage;
- Supabase;
- Vocaroo;
- database.

Những công nghệ này chỉ xuất hiện ở các tầng thích hợp,
đặc biệt là Adapter Layer hoặc Application/Assembly Layer.

## 15. Knowledge Boundary

Knowledge của BookCatalog trả lời:

> Book là gì?

> Page là gì?

> Page được sắp xếp như thế nào?

> Page liên kết với narration như thế nào?

> Stable identifiers dùng để làm gì?

> BookCatalog giao tiếp với capability nào?

Knowledge không trả lời:

> Làm thế nào để render image?

> Làm thế nào để phát audio?

> Làm thế nào để lưu dữ liệu vào database?

> Làm thế nào để gọi Vocaroo?

Những câu hỏi đó thuộc các tầng khác.

## 16. Architectural Principle

Nguyên tắc cốt lõi:

> Depend on WHAT, Never HOW.

BookCatalog biết WHAT:

- Book;
- Cover;
- Page;
- Page order;
- image reference;
- narration identifier.

BookCatalog không quyết định HOW:

- image được tải;
- narration được phát;
- browser hoạt động;
- dữ liệu được lưu;
- provider cung cấp resource.

## 17. Knowledge Summary

Có thể ghi nhớ `SBBox-BookCatalog` bằng chuỗi:

    Book
      ↓
    Pages
      ↓
    Page
      ├── image reference
      └── narration_id

BookCatalog là nơi giữ:

> cấu trúc logic của sách

chứ không phải nơi thực hiện:

> rendering, playback, navigation hoặc persistence.
