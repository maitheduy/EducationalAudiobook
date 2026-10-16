/**
 * SBBox-BookCatalog
 *
 * Capability:
 *   BookCatalog
 *
 * Contract:
 *   contracts/book-catalog.v1.json
 *
 * Responsibility:
 *   Expose the logical structure and content references
 *   of the educational book.
 *
 * Architectural rule:
 *   This Smart Box owns the BookCatalog capability,
 *   but does not own technology.
 */

/* ============================================================
 * Domain Types
 * ============================================================
 */

export interface BookPage {
  page_id: string;
  order: number;
  image: string;
  narration_id: string;
}

export interface BookCover {
  image: string;
}

export interface Book {
  book_id: string;
  title: string;
  cover: BookCover;
  pages: BookPage[];
}

export interface BookMetadata {
  book_id: string;
  title: string;
}

export interface BookCatalogContext {
  book_id: string;
}

/* ============================================================
 * Data Source Abstraction
 *
 * The Smart Box depends on WHAT data source can provide,
 * not HOW the data is stored or loaded.
 * ============================================================
 */

export interface BookCatalogDataSource {
  getBook(book_id: string): Book | undefined;
}

/* ============================================================
 * Errors
 * ============================================================
 */

export type BookCatalogErrorCode =
  | "BOOK_NOT_FOUND"
  | "PAGE_NOT_FOUND"
  | "NARRATION_NOT_ASSIGNED";

export class BookCatalogError extends Error {
  public readonly code: BookCatalogErrorCode;

  constructor(
    code: BookCatalogErrorCode,
    message: string
  ) {
    super(message);

    this.name = "BookCatalogError";
    this.code = code;
  }
}

/* ============================================================
 * SBBox-BookCatalog
 * ============================================================
 */

export class BookCatalogBox {
  private readonly context: BookCatalogContext;
  private readonly dataSource: BookCatalogDataSource;

  constructor(
    context: BookCatalogContext,
    dataSource: BookCatalogDataSource
  ) {
    this.context = context;
    this.dataSource = dataSource;
  }

  /* ----------------------------------------------------------
   * Internal Book Resolution
   * ----------------------------------------------------------
   */

  private requireBook(): Book {
    const book = this.dataSource.getBook(
      this.context.book_id
    );

    if (!book) {
      throw new BookCatalogError(
        "BOOK_NOT_FOUND",
        `Book '${this.context.book_id}' was not found.`
      );
    }

    return book;
  }

  /* ----------------------------------------------------------
   * loadBook
   *
   * Contract:
   *   input  -> {}
   *   output -> book
   * ----------------------------------------------------------
   */

  public loadBook(): Book {
    return this.requireBook();
  }

  /* ----------------------------------------------------------
   * getBookMetadata
   *
   * Contract:
   *   input  -> {}
   *   output -> object
   * ----------------------------------------------------------
   */

  public getBookMetadata(): BookMetadata {
    const book = this.requireBook();

    return {
      book_id: book.book_id,
      title: book.title
    };
  }

  /* ----------------------------------------------------------
   * getCover
   *
   * Contract:
   *   input  -> {}
   *   output -> { image }
   * ----------------------------------------------------------
   */

  public getCover(): BookCover {
    const book = this.requireBook();

    return {
      image: book.cover.image
    };
  }

  /* ----------------------------------------------------------
   * listPages
   *
   * Contract:
   *   input  -> {}
   *   output -> ordered array of pages
   *
   * Logical order is determined by page.order,
   * never by filename or filesystem order.
   * ----------------------------------------------------------
   */

  public listPages(): BookPage[] {
    const book = this.requireBook();

    return [...book.pages].sort(
      (a, b) => a.order - b.order
    );
  }

  /* ----------------------------------------------------------
   * getPage
   *
   * Contract:
   *   input  -> { page_id }
   *   output -> page
   * ----------------------------------------------------------
   */

  public getPage(page_id: string): BookPage {
    const book = this.requireBook();

    const page = book.pages.find(
      (item) => item.page_id === page_id
    );

    if (!page) {
      throw new BookCatalogError(
        "PAGE_NOT_FOUND",
        `Page '${page_id}' was not found in book '${book.book_id}'.`
      );
    }

    return page;
  }

  /* ----------------------------------------------------------
   * resolvePageNarration
   *
   * Contract:
   *   input  -> { page_id }
   *   output -> narration_id
   *
   * Important:
   *   This operation returns only the stable narration_id.
   *
   *   It does NOT resolve the narration provider,
   *   Vocaroo URL, browser resource, or playback mechanism.
   * ----------------------------------------------------------
   */

  public resolvePageNarration(
    page_id: string
  ): string {
    const page = this.getPage(page_id);

    if (
      !page.narration_id ||
      page.narration_id.trim().length === 0
    ) {
      throw new BookCatalogError(
        "NARRATION_NOT_ASSIGNED",
        `Page '${page_id}' has no narration identifier.`
      );
    }

    return page.narration_id;
  }
}
