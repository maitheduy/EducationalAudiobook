# SBBox-BookCatalog Rules

## 1. Contract Rule

`SBBox-BookCatalog` phải tuân thủ:

`contracts/book-catalog.v1.json`

Không được triển khai operation nằm ngoài Contract nếu chưa cập nhật:

- Contract;
- Smart Box Interface;
- Specification;
- Knowledge;
- Rules;
- Architecture.

## 2. Ownership Rule

`SBBox-BookCatalog` chỉ sở hữu:

- Book identity;
- Book metadata;
- Cover reference;
- Ordered page structure;
- Page identity;
- Page image reference;
- Page-to-narration relationship.

Không được nhận ownership đối với capability của Box khác.

## 3. Book Context Rule

`book_id` được cung cấp ở cấp Smart Box Context.

Các operation không được yêu cầu truyền lại `book_id` nếu Contract không quy định điều đó.

`book_id` không phải là một capability mới.

## 4. Stable Identifier Rule

Mọi Book, Page và Narration phải sử dụng stable identifier.

Các identifier:

- không được phụ thuộc vào framework;
- không được phụ thuộc vào browser;
- không được phụ thuộc vào storage technology;
- không được phụ thuộc vào narration provider.

## 5. Page Order Rule

Pages phải được cung cấp theo logical reading order.

`SBBox-BookCatalog` là nguồn của page order.

Không được để Adapter hoặc User Interface quyết định logical page order.

## 6. Page Reference Rule

Mỗi Page phải có:

- `page_id`;
- `order`;
- `image`;
- `narration_id`.

`image` chỉ là image reference.

`narration_id` chỉ là stable narration identifier.

Không được thay thế stable identifier bằng provider-specific resource trong BookCatalog.

## 7. Cover Rule

Cover là một thành phần của Book.

Cover có image reference.

Cover không bắt buộc phải có narration.

BookCatalog không được thêm playback logic cho Cover.

## 8. Narration Boundary Rule

BookCatalog chỉ được quản lý:

`Page → narration_id`

BookCatalog không được:

- play narration;
- pause narration;
- stop narration;
- quản lý narration state;
- truy cập trực tiếp Vocaroo;
- phụ thuộc vào Vocaroo API.

Các trách nhiệm trên thuộc `SBBox-Narration` và Adapter tương ứng.

## 9. Image Boundary Rule

BookCatalog chỉ cung cấp image reference.

BookCatalog không được:

- render image;
- tải image bằng Browser API;
- xử lý image element;
- phụ thuộc vào image loading technology.

## 10. Navigation Boundary Rule

BookCatalog cung cấp ordered pages.

BookCatalog không được:

- thay đổi current page;
- thực hiện next page;
- thực hiện previous page;
- thực hiện boundary navigation;
- điều khiển navigation state.

Các trách nhiệm navigation thuộc `SBBox-Navigation`.

## 11. ReadingSession Boundary Rule

BookCatalog cung cấp cấu trúc Book.

BookCatalog không được:

- tạo reading session;
- theo dõi reading progress;
- lưu session state;
- quản lý session lifecycle.

Các trách nhiệm này thuộc `SBBox-ReadingSession`.

## 12. Technology Independence Rule

Smart Box không được phụ thuộc trực tiếp vào:

- JavaScript;
- TypeScript;
- React;
- Vite;
- Browser API;
- LocalStorage;
- Supabase;
- Vocaroo;
- database.

Technology-specific logic phải nằm ở tầng thích hợp.

## 13. Adapter Boundary Rule

Adapter được phép biết technology.

Smart Box không được biết technology cụ thể của Adapter.

Mối quan hệ phải giữ nguyên:

    Smart Box
        │
        │ Capability Contract
        ▼
    Adapter
        │
        ▼
    Technology

Không được đảo ngược dependency này.

## 14. WHAT-not-HOW Rule

`SBBox-BookCatalog` phải mô tả:

> WHAT book resource exists.

Không được quyết định:

> HOW resource được lưu trữ, tải hoặc hiển thị.

## 15. No Rendering Rule

Không được đưa UI hoặc rendering logic vào BookCatalog.

Các thành phần như:

- HTML;
- CSS;
- React component;
- DOM manipulation;

không thuộc Smart Box này.

## 16. No Playback Rule

Không được đưa audio playback logic vào BookCatalog.

Các thành phần như:

- Audio API;
- HTMLAudioElement;
- play();
- pause();
- stop();

không thuộc Smart Box này.

## 17. No Persistence Rule

BookCatalog không được trực tiếp quản lý persistence technology.

Không được trực tiếp sử dụng:

- LocalStorage;
- IndexedDB;
- Supabase;
- PostgreSQL;
- database API.

## 18. No Provider Lock-in Rule

BookCatalog không được chứa:

- Vocaroo URL;
- Vocaroo API call;
- provider-specific audio metadata.

Provider-specific information phải được cô lập trong Adapter Layer.

## 19. Capability Expansion Rule

Không được tự ý thêm capability vào BookCatalog.

Nếu phát sinh capability mới phải thực hiện lại quy trình:

    Problem
       ↓
    Goal
       ↓
    Capability
       ↓
    Contract
       ↓
    Architecture
       ↓
    Smart Box
       ↓
    Implementation

## 20. Knowledge Alignment Rule

Mọi implementation của BookCatalog phải phù hợp với:

- `SBBox-Interface.json`;
- `SBBox-Specification.md`;
- `Knowledge.md`;
- `Rules.md`;
- Contract tương ứng.

Nếu có mâu thuẫn, không được tự ý chọn một phiên bản.

Phải dừng và xác định lại kiến trúc.

## 21. Human Approval Rule

Không được tự động thay đổi:

- Contract;
- ownership;
- capability boundary;
- architecture;
- security boundary;

mà không có Human approval.

## 22. Verification Rule

Implementation chỉ được coi là hợp lệ khi:

1. Tuân thủ Contract.
2. Tuân thủ Smart Box Interface.
3. Tuân thủ Specification.
4. Tuân thủ Knowledge.
5. Tuân thủ Rules.
6. Giữ đúng stable identifiers.
7. Giữ đúng page order.
8. Không phụ thuộc provider.
9. Không chứa rendering logic.
10. Không chứa playback logic.
11. Không chứa persistence technology.
12. Không mở rộng capability ngoài kiến trúc đã phê duyệt.

## 23. Final Rule

`SBBox-BookCatalog` là:

> **nguồn tri thức về cấu trúc logic của Book.**

Nó không phải là:

> UI renderer.

Không phải:

> Audio player.

Không phải:

> Navigation controller.

Không phải:

> Database.

Không phải:

> Vocaroo client.

BookCatalog chỉ làm đúng một việc:

> **Expose the logical structure of the Book.**
