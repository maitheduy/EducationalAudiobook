# CAPABILITY DECOMPOSITION

## 1. Purpose

This document defines the capability decomposition of the
EducationalAudiobook system according to SBBS 3.0.

The purpose of this phase is to identify WHAT the system must be
able to do before defining HOW those capabilities will be
implemented.

No technology, framework, provider, or implementation detail is
defined as part of a capability.

---

## 2. System Capability Tree

EducationalAudiobook
│
├── 1. BookCatalog
│   ├── LoadBook
│   ├── GetBookMetadata
│   ├── GetCover
│   ├── ListPages
│   ├── GetPage
│   └── ResolvePageNarration
│
├── 2. Narration
│   ├── ResolveNarration
│   ├── PlayNarration
│   ├── PauseNarration
│   ├── StopNarration
│   └── GetNarrationState
│
├── 3. Navigation
│   ├── GetCurrentPage
│   ├── GoToPage
│   ├── NextPage
│   ├── PreviousPage
│   ├── CanGoNext
│   └── CanGoPrevious
│
└── 4. ReadingSession
    ├── StartSession
    ├── GetSessionState
    ├── UpdateCurrentPage
    ├── TrackProgress
    └── EndSession

---

## 3. Capability Group 1 — BookCatalog

### Purpose

BookCatalog is responsible for describing and providing access to
the logical structure of the educational book.

### Primary Capability

BookCatalog

### Responsibilities

- represent the book
- represent the cover
- represent the interior pages
- maintain page ordering
- provide page information
- associate a page with its narration identifier

### Sub-capabilities

#### LoadBook

Load the logical book definition.

#### GetBookMetadata

Provide metadata describing the book.

#### GetCover

Provide the logical identity and resource reference of the cover.

#### ListPages

Return the ordered collection of interior pages.

#### GetPage

Return information about a specific page.

#### ResolvePageNarration

Identify the narration associated with a specific page.

### Boundary

BookCatalog knows WHAT the book contains.

BookCatalog does not know HOW images are loaded, HOW narration is
played, or HOW a browser renders the page.

---

## 4. Capability Group 2 — Narration

### Purpose

Narration is responsible for controlling the narration associated
with a page.

### Primary Capability

Narration

### Responsibilities

- identify a narration
- resolve a narration resource
- start narration
- pause narration
- stop narration
- report narration state

### Sub-capabilities

#### ResolveNarration

Resolve a stable narration identifier into an available narration
resource.

#### PlayNarration

Start playback of a narration.

#### PauseNarration

Pause the current narration.

#### StopNarration

Stop the current narration.

#### GetNarrationState

Provide the current state of narration.

### Boundary

Narration knows WHAT narration operation is requested.

Narration does not own the provider technology.

A provider such as Vocaroo is an Adapter concern.

---

## 5. Capability Group 3 — Navigation

### Purpose

Navigation is responsible for moving through the ordered pages of
the book.

### Primary Capability

Navigation

### Responsibilities

- identify the current page
- move to a specified page
- move to the next page
- move to the previous page
- determine whether forward navigation is possible
- determine whether backward navigation is possible

### Sub-capabilities

#### GetCurrentPage

Return the current page.

#### GoToPage

Move directly to a specified page.

#### NextPage

Move from the current page to the next available page.

#### PreviousPage

Move from the current page to the previous available page.

#### CanGoNext

Determine whether a next page exists.

#### CanGoPrevious

Determine whether a previous page exists.

### Boundary

Navigation knows the logical ordering of pages.

Navigation does not know how pages are visually rendered.

---

## 6. Capability Group 4 — ReadingSession

### Purpose

ReadingSession represents the user's current reading state.

### Primary Capability

ReadingSession

### Responsibilities

- start a reading session
- maintain current page
- maintain reading progress
- maintain relevant narration state
- provide session state
- end a reading session

### Sub-capabilities

#### StartSession

Create or initialize a reading session.

#### GetSessionState

Return the current reading session state.

#### UpdateCurrentPage

Update the page currently being read.

#### TrackProgress

Maintain the reader's progress through the book.

#### EndSession

End the current reading session.

### Boundary

ReadingSession coordinates reading state.

ReadingSession does not directly own storage technology.

---

## 7. Capability Relationships

The four primary capabilities are related as follows:

BookCatalog
    ↓
provides
    ↓
Pages + Narration Identifiers

Navigation
    ↓
selects
    ↓
Current Page

Current Page
    ↓
references
    ↓
Narration Identifier

Narration
    ↓
resolves and controls
    ↓
Current Page Narration

ReadingSession
    ↓
maintains
    ↓
Current Page + Reading Progress + Relevant State

---

## 8. Core Knowledge Flow

The conceptual knowledge flow is:

Book
  ↓
Page
  ↓
Narration ID
  ↓
Narration Resource
  ↓
Narration State

At the same time:

Book
  ↓
Ordered Pages
  ↓
Navigation
  ↓
Current Page
  ↓
ReadingSession

This creates the following central relationship:

Page
  ├── Image Resource
  └── Narration ID

---

## 9. Capability Independence from Technology

Capabilities must not directly depend on implementation
technologies.

For example:

PlayNarration

is a capability.

The following are implementation possibilities rather than
capabilities:

- Vocaroo
- Browser Audio
- HTML audio
- JavaScript
- React
- Web Audio API

The Smart Box depends on the capability contract.

The Adapter provides the technology-specific implementation.

Conceptually:

Smart Box
    ↓
Capability Contract
    ↓
Adapter
    ↓
Technology / Provider

---

## 10. Smart Box Boundaries

### SBBox-BookCatalog

Owns:

- book structure
- cover
- ordered pages
- page-to-narration relationship

Does not own:

- browser
- image loading technology
- audio provider
- application UI

---

### SBBox-Narration

Owns:

- narration lifecycle
- narration state
- narration operations

Does not own:

- Vocaroo
- browser implementation
- page navigation
- book structure

---

### SBBox-Navigation

Owns:

- page position
- page transitions
- navigation boundaries

Does not own:

- image rendering
- audio playback
- persistence technology

---

### SBBox-ReadingSession

Owns:

- reading session state
- reading progress
- coordination of relevant reading state

Does not own:

- database technology
- browser technology
- authentication
- UI framework

---

## 11. Non-Goals of Phase 2

This phase does not define:

- JSON contracts
- TypeScript interfaces
- JavaScript implementation
- React components
- Vite configuration
- HTML
- CSS
- browser APIs
- Vocaroo API implementation
- image loading implementation
- database schema
- authentication
- deployment

These concerns belong to later SBBS phases.

---

## 12. Phase 2 Conclusion

The EducationalAudiobook system has been decomposed into four
primary capability groups:

1. BookCatalog
2. Narration
3. Navigation
4. ReadingSession

Each primary capability has been decomposed into smaller
capabilities while preserving the distinction between WHAT the
system does and HOW technology implements it.

The next SBBS 3.0 phase is:

Phase 3 — Define Contracts

Contracts will translate the identified capabilities into explicit
machine-readable agreements before implementation begins.

---

## 13. Current Status

PHASE 2 — CAPABILITY DECOMPOSITION

STATUS: READY FOR PHASE 3
