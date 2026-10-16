# SBBox-BookCatalog Implementation Plan

## 1. Identity

- Smart Box: `SBBox-BookCatalog`
- Capability: `BookCatalog`
- Version: `1.0.0`
- Contract: `contracts/book-catalog.v1.json`
- Interface: `boxes/BookCatalog/SBBox-Interface.json`
- Specification: `boxes/BookCatalog/SBBox-Specification.md`
- Knowledge: `boxes/BookCatalog/Knowledge.md`
- Rules: `boxes/BookCatalog/Rules.md`

## 2. Implementation Goal

Implementation của `SBBox-BookCatalog` phải hiện thực đúng
capability `BookCatalog` đã được định nghĩa trong Contract.

Implementation phải:

- cung cấp đúng các operation;
- duy trì đúng logical structure của Book;
- duy trì stable identifiers;
- trả về pages theo logical reading order;
- giữ đúng Page-to-Narration relationship;
- không phụ thuộc trực tiếp vào Vocaroo;
- không chứa rendering logic;
- không chứa playback logic;
- không chứa navigation logic;
- không chứa persistence technology.

## 3. Implementation Principle

Implementation phải tuân thủ:

> Contract Before Implementation.

Implementation không được tự định nghĩa lại capability.

Contract là nguồn quy định:

- operation;
- input;
- output;
- entity;
- rule;
- error.

## 4. Data Source

Dữ liệu logic của Book được cung cấp từ Data Layer.

BookCatalog cần một nguồn dữ liệu mô tả:

- book identity;
- book metadata;
- cover image reference;
- ordered pages;
- page identity;
- page image reference;
- page narration identifier.

Dữ liệu cụ thể của cuốn sách không được hard-code vào
Smart Box implementation.

## 5. Book Context

`book_id` được cung cấp ở Smart Box Context.

Implementation phải sử dụng `book_id` từ Context để xác định
Book đang được phục vụ.

Các operation không nhận lại `book_id` nếu Contract không yêu cầu.

Mô hình:

    SBBox-BookCatalog
          │
          └── Context
               └── book_id
                    │
                    ▼
                  Book

## 6. Data Layer Boundary

Book data phải được tổ chức như một nguồn dữ liệu khai báo.

Smart Box có thể yêu cầu dữ liệu Book thông qua một abstraction
phù hợp với capability.

Smart Box không được phụ thuộc trực tiếp vào:

- filesystem API;
- browser API;
- LocalStorage;
- Supabase;
- PostgreSQL;
- Vocaroo;
- HTTP client cụ thể.

Technology-specific access phải được cô lập ở Adapter Layer
hoặc Data Adapter thích hợp.

## 7. Logical Book Model

Implementation phải hỗ trợ mô hình logic:

    Book
    ├── book_id
    ├── metadata
    ├── cover
    │   └── image
    │
    └── pages
        ├── page_id
        ├── order
        ├── image
        └── narration_id

Pages phải được duy trì theo `order`.

## 8. Stable Identifier Handling

Implementation không được biến đổi hoặc thay thế:

- `book_id`;
- `page_id`;
- `narration_id`

bằng technology-specific identifier.

Stable identifiers phải được giữ nguyên khi đi qua các
operation của BookCatalog.

## 9. Operation Mapping

Implementation phải ánh xạ trực tiếp các operation trong Contract.

### loadBook

Input:

- không có operation parameter.

Context:

- `book_id`.

Output:

- `book`.

### getBookMetadata

Input:

- không có operation parameter.

Context:

- `book_id`.

Output:

- book metadata.

### getCover

Input:

- không có operation parameter.

Context:

- `book_id`.

Output:

- cover image reference.

### listPages

Input:

- không có operation parameter.

Context:

- `book_id`.

Output:

- ordered array of pages.

### getPage

Input:

- `page_id`.

Context:

- `book_id`.

Output:

- page.

### resolvePageNarration

Input:

- `page_id`.

Context:

- `book_id`.

Output:

- stable `narration_id`.

## 10. Error Handling

Implementation phải ánh xạ các lỗi đã được định nghĩa trong Contract.

Các lỗi tối thiểu:

- `BOOK_NOT_FOUND`
- `PAGE_NOT_FOUND`
- `NARRATION_NOT_ASSIGNED`

Không được tự ý thay đổi ý nghĩa của các lỗi này.

Nếu cần thêm error mới, phải cập nhật Contract trước.

## 11. Ordering Rule

`listPages()` phải trả về pages theo logical reading order.

Implementation không được:

- sắp xếp theo filename nếu điều đó khác với `order`;
- sắp xếp theo thời gian tạo file;
- sắp xếp theo filesystem order;
- để UI quyết định page order.

Logical order phải đến từ Book data model.

## 12. Narration Relationship

Implementation chỉ duy trì:

    page_id → narration_id

Implementation không được resolve:

    narration_id → Vocaroo URL

Việc resolve narration resource thuộc `SBBox-Narration`
và Narration Adapter.

## 13. Image Relationship

Implementation chỉ duy trì:

    page_id → image reference

Implementation không được:

- render image;
- tạo HTML image element;
- thao tác DOM;
- gọi Browser API để hiển thị image.

## 14. Technology Isolation

Nếu implementation cần technology-specific functionality,
functionality đó phải được cung cấp qua Adapter hoặc abstraction
phù hợp.

Mô hình:

    SBBox-BookCatalog
           │
           │ capability contract
           ▼
        Adapter
           │
           ▼
      Technology

Không được để:

    SBBox-BookCatalog
           │
           ▼
      Technology API

## 15. First Implementation Target

Implementation đầu tiên chỉ tập trung vào capability
`BookCatalog`.

Không triển khai đồng thời:

- Narration;
- Navigation;
- ReadingSession;
- UI;
- Browser integration;
- persistence;
- authentication;
- deployment.

## 16. Proposed Implementation Artifact

Sau khi Implementation Plan được phê duyệt, Smart Box sẽ có
một implementation artifact:

`boxes/BookCatalog/box.ts`

Artifact này chỉ chứa logic của `SBBox-BookCatalog`.

Implementation không được chứa:

- React component;
- JSX;
- CSS;
- HTML;
- browser event handler;
- audio playback;
- Vocaroo API call;
- database client.

## 17. Adapter Responsibility

Adapter Layer sẽ chịu trách nhiệm về technology-specific concerns.

Ví dụ:

    Image Adapter
        └── image resource access

    Vocaroo Adapter
        └── narration resource resolution

    Browser Adapter
        └── browser-specific interaction

BookCatalog không được biết implementation cụ thể của các
Adapter này.

## 18. Assembly Boundary

BookCatalog implementation chưa được kết nối trực tiếp với:

- Navigation;
- Narration;
- ReadingSession;
- Browser UI.

Các kết nối capability sẽ được xác định trong
`connection-plan.yaml` ở Assembly/Connection phase.

## 19. Verification Before Implementation

Trước khi tạo `box.ts`, phải xác nhận:

1. Contract đã được phê duyệt.
2. Interface đã được phê duyệt.
3. Specification đã được phê duyệt.
4. Knowledge đã được tạo.
5. Rules đã được tạo.
6. Implementation Plan đã được phê duyệt.

## 20. Human Approval Gate

Implementation Plan này không tự động cho phép triển khai code.

Sau khi Plan được kiểm tra, cần Human Approval trước khi tạo:

`boxes/BookCatalog/box.ts`

## 21. Implementation Principle Summary

Implementation của `SBBox-BookCatalog` phải tuân thủ:

> Box Owns Capability.

> Box Does Not Own Technology.

> Depend on WHAT, Never HOW.

> Contract Before Implementation.

> Knowledge Alongside Code.

> Human-in-the-Loop.
