/**
 * BookDataAdapter
 *
 * Capability:
 *   BookDataSource
 *
 * Contract:
 *   contracts/book-data-source.v1.json
 *
 * Consumer:
 *   SBBox-BookCatalog
 *
 * Responsibility:
 *   Provide logical Book data from the declared
 *   Book Data Resource.
 *
 * Architectural rule:
 *   Adapter owns HOW.
 *   Smart Box depends on WHAT.
 */

import {
  Book,
  BookCatalogDataSource
} from "../../boxes/BookCatalog/box";

/* ============================================================
 * Errors
 * ============================================================
 */

export type BookDataSourceErrorCode =
  | "BOOK_NOT_FOUND"
  | "BOOK_DATA_INVALID";

export class BookDataSourceError extends Error {
  public readonly code: BookDataSourceErrorCode;

  constructor(
    code: BookDataSourceErrorCode,
    message: string
  ) {
    super(message);

    this.name = "BookDataSourceError";
    this.code = code;
  }
}

/* ============================================================
 * Raw Book Data
 *
 * This represents the shape read from the Book Data Resource.
 * ============================================================
 */

interface RawBookPage {
  page_id?: unknown;
  order?: unknown;
  image?: unknown;
  narration_id?: unknown;
}

interface RawBook {
  book_id?: unknown;
  title?: unknown;
  cover?: {
    image?: unknown;
  };
  pages?: unknown;
}

/* ============================================================
 * BookDataAdapter
 * ============================================================
 */

export class BookDataAdapter
  implements BookCatalogDataSource
{
  private readonly bookData: unknown;

  constructor(bookData: unknown) {
    this.bookData = bookData;
  }

  /* ----------------------------------------------------------
   * getBook
   *
   * Contract:
   *   input  -> { book_id }
   *   output -> book
   * ----------------------------------------------------------
   */

  public getBook(
    book_id: string
  ): Book | undefined {
    if (!book_id || book_id.trim().length === 0) {
      throw new BookDataSourceError(
        "BOOK_NOT_FOUND",
        "Book identifier is empty."
      );
    }

    const book = this.validateBook(this.bookData);

    if (book.book_id !== book_id) {
      return undefined;
    }

    return book;
  }

  /* ----------------------------------------------------------
   * validateBook
   *
   * Converts raw data into the logical Book model.
   * Technology-specific parsing/loading remains outside
   * the Smart Box.
   * ----------------------------------------------------------
   */

  private validateBook(
    value: unknown
  ): Book {
    if (
      typeof value !== "object" ||
      value === null
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        "Book data must be an object."
      );
    }

    const raw = value as RawBook;

    if (
      typeof raw.book_id !== "string" ||
      raw.book_id.trim().length === 0
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        "Book data must contain a valid book_id."
      );
    }

    if (
      typeof raw.title !== "string" ||
      raw.title.trim().length === 0
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        "Book data must contain a valid title."
      );
    }

    if (
      typeof raw.cover !== "object" ||
      raw.cover === null ||
      typeof raw.cover.image !== "string" ||
      raw.cover.image.trim().length === 0
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        "Book data must contain a valid cover image reference."
      );
    }

    if (!Array.isArray(raw.pages)) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        "Book data must contain a pages array."
      );
    }

    const pages = raw.pages.map(
      (page, index) =>
        this.validatePage(page, index)
    );

    return {
      book_id: raw.book_id,
      title: raw.title,
      cover: {
        image: raw.cover.image
      },
      pages
    };
  }

  /* ----------------------------------------------------------
   * validatePage
   * ----------------------------------------------------------
   */

  private validatePage(
    value: unknown,
    index: number
  ): {
    page_id: string;
    order: number;
    image: string;
    narration_id: string;
  } {
    if (
      typeof value !== "object" ||
      value === null
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        `Page at index ${index} must be an object.`
      );
    }

    const page = value as RawBookPage;

    if (
      typeof page.page_id !== "string" ||
      page.page_id.trim().length === 0
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        `Page at index ${index} has an invalid page_id.`
      );
    }

    if (
      typeof page.order !== "number" ||
      !Number.isInteger(page.order)
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        `Page '${page.page_id}' has an invalid order.`
      );
    }

    if (
      typeof page.image !== "string" ||
      page.image.trim().length === 0
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        `Page '${page.page_id}' has an invalid image reference.`
      );
    }

    if (
      typeof page.narration_id !== "string" ||
      page.narration_id.trim().length === 0
    ) {
      throw new BookDataSourceError(
        "BOOK_DATA_INVALID",
        `Page '${page.page_id}' has an invalid narration_id.`
      );
    }

    return {
      page_id: page.page_id,
      order: page.order,
      image: page.image,
      narration_id: page.narration_id
    };
  }
}
