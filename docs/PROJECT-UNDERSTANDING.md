# PROJECT UNDERSTANDING

## 1. Project Identity

- Project: EducationalAudiobook
- Architecture: SBBS 3.0
- Purpose: Educational comic + narration webbook
- Current scope: One educational book

## 2. Problem

The project needs to transform a static educational comic into a structured digital reading experience in which each interior page can be associated with its corresponding narration.

The system should keep educational content, capabilities, and technology-specific implementations separated.

## 3. Goal

Build an EducationalAudiobook system that provides:

1. A cover page.
2. Ten interior comic pages.
3. One narration associated with each interior page.
4. Page-by-page navigation.
5. Audio playback associated with the current page.
6. A declarative architecture following SBBS 3.0.
7. Technology-specific details isolated inside Adapters.

## 4. Book Structure

The current book contains:

- 1 cover
- 10 interior pages
- 10 narrations

The cover does not have narration.

The interior pages have a one-to-one relationship with narrations.

```text
cover
  └── no narration

page-01 ── narration audio-01
page-02 ── narration audio-02
page-03 ── narration audio-03
page-04 ── narration audio-04
page-05 ── narration audio-05
page-06 ── narration audio-06
page-07 ── narration audio-07
page-08 ── narration audio-08
page-09 ── narration audio-09
page-10 ── narration audio-10
```

## 5. Assets

Image assets are stored in:

```text
public/images/
```

Current assets:

```text
cover.png
page-01.png
page-02.png
page-03.png
page-04.png
page-05.png
page-06.png
page-07.png
page-08.png
page-09.png
page-10.png
```

Total: 11 images: 1 cover + 10 interior pages.

## 6. Narration

There are 10 narrations.

Stable internal identifiers:

```text
audio-01
audio-02
audio-03
audio-04
audio-05
audio-06
audio-07
audio-08
audio-09
audio-10
```

The narration provider currently used is Vocaroo.

The Vocaroo URLs are isolated in:

```text
adapters/Vocaroo/vocaroo-manifest.json
```

The Smart Boxes must not depend directly on Vocaroo URLs.

## 7. Page-to-Narration Relationship

The conceptual relationship is:

```text
page-01 → audio-01
page-02 → audio-02
page-03 → audio-03
page-04 → audio-04
page-05 → audio-05
page-06 → audio-06
page-07 → audio-07
page-08 → audio-08
page-09 → audio-09
page-10 → audio-10
```

The page model should depend on the stable narration identifier, not on a provider-specific URL.

## 8. Architecture

The project follows these major SBBS 3.0 layers:

```text
Knowledge / Documentation
        ↓
Contracts
        ↓
Smart Boxes
        ↓
Adapters
        ↓
Assembly
        ↓
Application
```

Current Smart Boxes:

```text
boxes/
├── BookCatalog/
├── Narration/
├── Navigation/
└── ReadingSession/
```

Current Adapters:

```text
adapters/
├── Browser/
├── Image/
└── Vocaroo/
```

## 9. Smart Box Responsibilities

### BookCatalog

Responsible for the conceptual structure of the book:
- cover
- pages
- page ordering
- page-to-narration association

It must not know how Vocaroo works.

### Narration

Responsible for narration capabilities such as:
- resolving a narration
- playing narration
- pausing narration
- stopping narration

The exact contract will be defined later.

### Navigation

Responsible for moving through the book:
- next page
- previous page
- current page
- boundary handling

### ReadingSession

Responsible for the state of a reading session, such as:
- current page
- reading progress
- current narration state

The exact state model will be defined later.

## 10. Adapters

### Vocaroo Adapter

Provides the technology-specific connection between stable narration identifiers and Vocaroo resources.

### Image Adapter

Responsible for technology-specific image access.

### Browser Adapter

Responsible for technology-specific browser capabilities.

## 11. Public Data

The directory public/data/ is reserved for declarative public data and manifests.

No application implementation is placed here.

## 12. Current Constraints

1. The system contains exactly one cover.
2. The system contains exactly ten interior pages.
3. The cover has no narration.
4. Each interior page has exactly one narration.
5. There are exactly ten narration identifiers.
6. Vocaroo URLs are isolated in the Vocaroo Adapter.
7. Smart Boxes must not directly depend on Vocaroo.
8. Technology-specific implementation belongs in Adapters.
9. Application implementation has not yet begun.
10. Contracts have not yet been finalized.

## 13. Non-Goals of the Current Phase

The current phase does not implement:
- React
- Vite
- UI
- audio player code
- page rendering code
- database
- authentication
- Supabase
- API server
- application state implementation
- deployment configuration

## 14. SBBS 3.0 Principles

1. Capability Before Code.
2. Contract Before Connection.
3. Contract Before Implementation.
4. Box Owns Capability.
5. Box Does Not Own Technology.
6. Depend on WHAT, Never HOW.
7. Knowledge Alongside Code.
8. AI-readable by Default.
9. Declarative Connection.
10. Human-in-the-Loop.

## 15. Phase 0 Approval Criteria

Phase 0 is complete only when the following are confirmed:
- The problem is correctly understood.
- The project goal is correctly understood.
- The book structure is correct.
- The asset structure is correct.
- The narration structure is correct.
- The page-to-narration relationship is correct.
- Smart Box responsibilities are understood.
- Adapter responsibilities are understood.
- Current constraints are accepted.
- Non-goals are accepted.

## 16. Approval Gate 1

Human approval is required before continuing to the next phase.

Status:

PENDING HUMAN APPROVAL

No contracts, Smart Box implementations, adapters, connection plans, or application code should be implemented before Approval Gate 1 is passed.
