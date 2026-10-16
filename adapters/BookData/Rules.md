# Book Data Adapter — Rules

## 1. Contract Compliance

Book Data Adapter MUST implement:

`contracts/book-data-source.v1.json`

Adapter Interface MUST remain consistent with the Contract.

If the Contract changes, the Adapter Interface and implementation
must be reviewed before continuing.

## 2. Stable Book Identifier

Adapter MUST accept a stable:

`book_id`

Adapter MUST use that identifier to resolve the requested Book.

Adapter MUST NOT silently replace `book_id` with:

- filename;
- array index;
- database-generated identifier;
- provider-specific identifier.

## 3. Book Integrity

Adapter MUST return a logical Book that conforms to the
BookCatalog domain model.

The Book MUST preserve:

- `book_id`;
- `title`;
- `cover`;
- ordered `pages`.

Each page MUST preserve:

- `page_id`;
- `order`;
- `image`;
- `narration_id`.

## 4. Stable Page Identifier

Adapter MUST preserve `page_id`.

Adapter MUST NOT generate a new page identifier when returning
Book data.

## 5. Stable Narration Identifier

Adapter MUST preserve `narration_id`.

Adapter MUST NOT transform:

`narration_id`

into:

- Vocaroo URL;
- browser audio resource;
- audio element;
- provider-specific identifier.

Narration provider resolution belongs to the Narration capability
and its Adapter.

## 6. Technology Boundary

Technology-specific code MUST remain inside the Adapter.

The Adapter MAY use an appropriate technology to access Book data.

However, technology details MUST NOT leak into:

- `SBBox-BookCatalog`;
- BookCatalog Contract;
- BookCatalog Knowledge;
- BookCatalog Rules.

## 7. No BookCatalog Business Logic

Adapter MUST NOT implement BookCatalog business rules.

Adapter MUST NOT decide:

- how pages are navigated;
- which page is current;
- whether navigation can move next;
- whether navigation can move previous;
- how reading progress is calculated;
- how narration is played.

These responsibilities belong to their respective Smart Boxes.

## 8. No Navigation

Adapter MUST NOT:

- move between pages;
- maintain current page state;
- implement `nextPage`;
- implement `previousPage`;
- enforce UI navigation.

Navigation belongs to:

`SBBox-Navigation`

## 9. No Narration Playback

Adapter MUST NOT:

- play narration;
- pause narration;
- stop narration;
- maintain narration playback state.

These responsibilities belong to:

`SBBox-Narration`

## 10. No Image Rendering

Adapter MUST NOT:

- render images;
- create HTML image elements;
- manipulate the DOM;
- control image presentation.

The Adapter only provides the logical image reference
contained in Book data.

## 11. No Reading Session

Adapter MUST NOT:

- create reading sessions;
- maintain session state;
- calculate reading progress;
- persist reading progress.

These responsibilities belong to:

`SBBox-ReadingSession`

## 12. No User Interface

Adapter MUST NOT contain:

- React components;
- JSX;
- HTML;
- CSS;
- UI event handlers;
- presentation logic.

## 13. Error Handling

Adapter MUST expose the Contract-defined errors:

- `BOOK_NOT_FOUND`
- `BOOK_DATA_INVALID`

The meaning of these errors MUST remain consistent with the
BookDataSource Contract.

## 14. Invalid Data

If the source contains data that cannot be represented as a
valid logical Book, the Adapter MUST NOT silently return
incomplete or corrupted Book data.

It MUST report:

`BOOK_DATA_INVALID`

## 15. Missing Book

If the requested `book_id` does not exist, the Adapter MUST
report:

`BOOK_NOT_FOUND`

## 16. No Silent Mutation

Adapter MUST NOT silently modify Book data to compensate for
invalid source data.

Any transformation performed by the Adapter must preserve the
logical meaning of the Book.

## 17. Separation of WHAT and HOW

The Adapter owns:

> HOW Book data is accessed.

The Contract defines:

> WHAT Book data can be provided.

The Smart Box consumes:

> WHAT Book data is available.

These boundaries MUST remain separate.

## 18. Knowledge Alignment

Implementation MUST remain consistent with:

- `Adapter-Interface.json`;
- `Knowledge.md`;
- this `Rules.md`;
- `contracts/book-data-source.v1.json`.

If implementation requirements conflict with these documents,
implementation MUST stop until the documents are reviewed.

## 19. Adapter Replacement

The architecture MUST allow the Book Data Adapter to be replaced
without changing `SBBox-BookCatalog`.

For example, the data source may later change from:

    Static Data

to:

    JSON

or:

    API

or:

    Database

without changing the BookCatalog capability contract.

## 20. Human Approval

The Adapter MUST NOT be implemented until:

1. Contract is approved.
2. Adapter Interface is approved.
3. Knowledge is created.
4. Rules are created.
5. Implementation design is approved.

## 21. Final Rule

Book Data Adapter is an architectural boundary between:

    Logical Book Data

and

    Technology-specific Data Access.

Its responsibility is strictly:

> Provide Book data.

It does not own:

- BookCatalog business rules;
- Navigation;
- Narration;
- Image rendering;
- ReadingSession;
- User Interface.

The Adapter owns HOW.

The Smart Box depends on WHAT.
