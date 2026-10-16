# CAPABILITY INVENTORY

## 1. Purpose

This document records the capabilities and resources currently
identified in the EducationalAudiobook project during SBBS 3.0
Phase 1 — Discover Existing Capabilities.

This inventory distinguishes between:

- EXISTING
- PARTIAL
- MISSING

A directory or placeholder is not considered an implemented
capability unless its capability has actually been verified.

---

## 2. EXISTING

### 2.1 Image Assets

Status:

EXISTING

Location:

public/images/

Verified assets:

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

Total:

11 images = 1 cover + 10 interior pages

Verified image properties:

Format: PNG
Dimensions: 1024 × 1536
Color: RGB
Depth: 8-bit

---

### 2.2 Vocaroo Narration Resource Mapping

Status:

EXISTING

Adapter location:

adapters/Vocaroo/

Manifest:

adapters/Vocaroo/vocaroo-manifest.json

Verified stable narration identifiers:

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

Each narration identifier has a corresponding Vocaroo embed_url.

The provider-specific URLs are isolated inside the Vocaroo Adapter.

---

## 3. PARTIAL

### 3.1 Adapter Structure

Status:

PARTIAL

Existing directories:

adapters/
├── Browser/
├── Image/
└── Vocaroo/

The Vocaroo Adapter contains a verified manifest.

The Browser and Image Adapter directories currently exist as
architectural placeholders, but their capabilities have not yet
been implemented or formally verified.

---

### 3.2 Smart Box Structure

Status:

PARTIAL

Existing Smart Box directories:

boxes/
├── BookCatalog/
├── Narration/
├── Navigation/
└── ReadingSession/

These directories establish the intended architectural locations
for the Smart Boxes.

However, no Smart Box capability implementation has yet been
created or verified.

Therefore these are architectural placeholders rather than
implemented capabilities.

---

## 4. MISSING

### 4.1 BookCatalog Capability

Status:

MISSING

Required conceptual responsibility:

- represent the book
- represent the cover
- represent the interior pages
- maintain page ordering
- associate pages with stable narration identifiers

No implementation currently exists.

---

### 4.2 Narration Capability

Status:

MISSING

Required conceptual responsibility:

- resolve narration
- play narration
- pause narration
- stop narration

No capability contract or implementation currently exists.

The Vocaroo resource mapping exists, but the Narration Smart Box
capability does not yet exist.

---

### 4.3 Navigation Capability

Status:

MISSING

Required conceptual responsibility:

- identify current page
- move to next page
- move to previous page
- handle navigation boundaries

No implementation currently exists.

---

### 4.4 ReadingSession Capability

Status:

MISSING

Required conceptual responsibility:

- maintain current page
- maintain reading progress
- maintain current narration state

No implementation currently exists.

---

### 4.5 Capability Contracts

Status:

MISSING

Location reserved:

contracts/

No finalized capability contracts currently exist.

Contracts will be defined in a later SBBS 3.0 phase.

---

### 4.6 Assembly

Status:

MISSING

Location reserved:

assembly/

No Assembly implementation or Assembly contract currently exists.

Assembly will be designed only after the required capabilities,
contracts, Smart Boxes, and adapters have been defined.

---

### 4.7 Application / UI

Status:

MISSING

No application implementation currently exists.

The following are intentionally not implemented:

- React
- Vite
- UI
- audio player
- page rendering
- application state
- database
- authentication
- API server
- Supabase
- deployment configuration

---

## 5. Capability Summary

| Area | Status | Evidence |
|---|---|---|
| Cover image | EXISTING | public/images/cover.png |
| 10 page images | EXISTING | public/images/page-01.png … page-10.png |
| Narration IDs | EXISTING | audio-01 … audio-10 |
| Vocaroo mapping | EXISTING | adapters/Vocaroo/vocaroo-manifest.json |
| Browser Adapter | PARTIAL | Directory exists; no implementation |
| Image Adapter | PARTIAL | Directory exists; no implementation |
| Vocaroo Adapter | PARTIAL | Manifest exists; runtime adapter not yet defined |
| BookCatalog | MISSING | No implementation |
| Narration | MISSING | No implementation |
| Navigation | MISSING | No implementation |
| ReadingSession | MISSING | No implementation |
| Contracts | MISSING | No finalized contracts |
| Assembly | MISSING | No implementation |
| Application/UI | MISSING | Not started |

---

## 6. Important SBBS 3.0 Distinction

The following distinction is mandatory:

Directory exists ≠ Capability exists

A capability is considered EXISTING only when its actual capability
can be identified and verified.

Architectural placeholders are recorded as PARTIAL or MISSING
rather than being treated as implemented capabilities.

---

## 7. Phase 1 Conclusion

The project currently has verified content resources and a verified
Vocaroo narration mapping, but the core application capabilities
have not yet been implemented.

The next architectural task is therefore not implementation.

The next task is:

Phase 2 — Capability Decomposition

Phase 2 will decompose the required system capabilities before any
capability contract or implementation is created.

---

## 8. Current Status

PHASE 1 — DISCOVER EXISTING CAPABILITIES

STATUS: READY FOR PHASE 2
