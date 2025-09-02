# Salt & Silver: Phaser 3 Refactoring Guide

## Project Status & Objectives

**Current Situation:** Our Phaser 3 codebase has grown to a large monolithic structure that presents maintainability challenges. Previous refactoring attempts resulted in performance degradation and feature parity issues.

**Goal:** Implement a hybrid modular architecture that improves code organization while maintaining 100% performance parity with the stable monolithic version.

**Success Criteria:**
- Zero performance regression (60 FPS maintained)
- Feature parity with last stable commit
- Improved developer experience and code navigation
- Reduced cross-team coordination friction

---

## Core Principles

### 1. Performance First
- **Never sacrifice game loop performance for architectural purity**
- All performance-critical code stays in main game scenes
- Benchmark before and after every extraction
- If performance drops >2%, revert immediately

### 2. Gradual Extraction Strategy
- Extract one system at a time with full testing
- Each extraction must be completable in 2-3 days maximum
- Maintain working builds at all times
- No "big bang" refactors

### 3. Feature-Based Organization
- Group code by game features, not technical layers
- Keep related functionality together
- Avoid premature abstraction

---

## Refactoring Phases

### Phase 1: Safe Extractions (Week 1-2)
Extract systems that **DO NOT** affect core game loop performance:

**Priority 1 - UI Systems:**
```javascript
// Extract to: src/systems/ui/
- Menu management
- HUD updates (non-critical)
- Dialog systems
- Settings panels
```

**Priority 2 - Utility Systems:**
```javascript
// Extract to: src/systems/utilities/
- Save/Load functionality
- Audio management
- Configuration management
- Asset loading helpers
```

**Priority 3 - Static Data:**
```javascript
// Extract to: src/data/
- Commodity definitions
- Island configurations
- Faction data
- Event definitions
```

### Phase 2: Performance-Safe Boundaries (Week 3-4)
Create organized interfaces while keeping performance-critical code intact:

**Core Game Loop - NEVER EXTRACT:**
```javascript
// These stay in main scene files:
- update() methods
- Physics