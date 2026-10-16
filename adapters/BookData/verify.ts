import { readFileSync } from "node:fs";

import {
  BookDataAdapter,
  BookDataSourceError
} from "./box";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

const bookPath = "public/data/book.json";

const bookData = JSON.parse(
  readFileSync(bookPath, "utf-8")
);

/* ============================================================
 * 1. Create Adapter
 * ============================================================
 */

const adapter = new BookDataAdapter(bookData);

/* ============================================================
 * 2. Resolve Valid Book
 * ============================================================
 */

const book = adapter.getBook(
  "educational-audiobook-001"
);

assert(
  book !== undefined,
  "Book should be resolved."
);

assert(
  book!.book_id === "educational-audiobook-001",
  "Book ID must be preserved."
);

assert(
  book!.title ===
    "Sách giáo khoa và Bộ truyền dẫn kiến thức",
  "Book title must be preserved."
);

assert(
  book!.cover.image === "cover.png",
  "Cover image must be preserved."
);

/* ============================================================
 * 3. Verify Pages
 * ============================================================
 */

assert(
  book!.pages.length === 10,
  "Book must contain exactly 10 pages."
);

for (let i = 1; i <= 10; i++) {
  const page = book!.pages[i - 1];

  const pageId = `page-${String(i).padStart(2, "0")}`;
  const audioId = `audio-${String(i).padStart(2, "0")}`;

  assert(
    page.page_id === pageId,
    `${pageId} must be preserved.`
  );

  assert(
    page.order === i,
    `${pageId} order must be ${i}.`
  );

  assert(
    page.image === `${pageId}.png`,
    `${pageId} image reference must be preserved.`
  );

  assert(
    page.narration_id === audioId,
    `${pageId} narration ID must be ${audioId}.`
  );
}

/* ============================================================
 * 4. Verify BOOK_NOT_FOUND
 * ============================================================
 */

const missingBook =
  adapter.getBook("book-does-not-exist");

assert(
  missingBook === undefined,
  "Unknown book must not resolve to a Book."
);

/* ============================================================
 * 5. Verify BOOK_DATA_INVALID
 * ============================================================
 */

let invalidDataDetected = false;

try {
  const invalidAdapter =
    new BookDataAdapter({
      book_id: "invalid-book"
    });

  invalidAdapter.getBook("invalid-book");
} catch (error) {
  if (
    error instanceof BookDataSourceError &&
    error.code === "BOOK_DATA_INVALID"
  ) {
    invalidDataDetected = true;
  }
}

assert(
  invalidDataDetected,
  "Invalid Book data must produce BOOK_DATA_INVALID."
);

/* ============================================================
 * 6. Verify Vocaroo Isolation
 * ============================================================
 */

const serializedData =
  JSON.stringify(book);

assert(
  !serializedData.includes("voca.ro"),
  "Book data must not contain a Vocaroo URL."
);

assert(
  !serializedData.toLowerCase().includes("vocaroo"),
  "Book data must not contain Vocaroo provider information."
);

/* ============================================================
 * Result
 * ============================================================
 */

console.log("");
console.log("============================================================");
console.log("BOOK DATA ADAPTER — VERIFICATION");
console.log("============================================================");

console.log("Book resolution: PASS");
console.log("Book metadata: PASS");
console.log("Cover reference: PASS");
console.log("10 pages: PASS");
console.log("Page IDs: PASS");
console.log("Page order: PASS");
console.log("Image references: PASS");
console.log("Narration IDs: PASS");
console.log("BOOK_NOT_FOUND behavior: PASS");
console.log("BOOK_DATA_INVALID behavior: PASS");
console.log("Vocaroo isolation: PASS");

console.log("");
console.log("BookDataAdapter verification: PASS");
console.log("============================================================");
