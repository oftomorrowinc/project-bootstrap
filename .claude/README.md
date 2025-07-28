# Agent-Driven Development Workflow

## Overview

This system uses a **single specs file** with **checkbox-based user scenarios** and **6 specialized agents** to implement features rapidly with comprehensive testing.

## How It Works

1. **You manage** the specs file (`docs/specs.md`) - add features, update scenarios, manage project scope
2. **Claude Code implements** - runs 6-agent workflow to build exactly what's specified
3. **Agents check off** completed scenarios automatically as they implement them
4. **Shared mock testing** ensures unit and E2E tests stay perfectly synchronized

## Quick Start

### 1. Add Feature to Specs File
```markdown
## ☐ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully  
- User sees validation error for invalid email format

WHY: Users need to manage their account information
DEPENDS: 012
NOTE: Keep form simple, can add avatar upload later
```

### 2. Implement with Claude Code
```bash
/implement-spec 015
```

### 3. Watch Progress
Claude Code will:
- Run 6-agent workflow (planning → backend → jest → frontend → manual-testing → playwright)
- Implement all bullet point scenarios in the spec
- Update spec header when complete: ☐ → ☑

## Available Commands

### Implementation
- `/implement-spec 015` - Implement all unchecked scenarios in spec 015
- `/implement-spec 015-018` - Implement all unchecked scenarios in specs 015 through 018
- `/implement-spec 015,017,020` - Implement specific specs in order

### Quick Prototyping  
- `/quick-implement 015` - Rapid implementation with minimal testing (for prototypes)

### Spec Management
- `/create-spec 025` - Generate new spec template in specs file

## The 6-Agent Workflow

### 1. @planning-agent
- Analyzes your spec and reviews existing codebase
- **Creates shared mock contracts** in `lib/test-mocks.ts` 
- Makes implementation plan for other agents

### 2. @backend-agent  
- Implements APIs matching shared mock contracts exactly
- Creates server-side functionality

### 3. @jest-agent
- **Creates unit tests** using shared mock data
- Tests APIs and components comprehensively

### 4. @frontend-agent
- **Uses shared mock contracts** for data structure clarity
- Builds UI components with proper validation

### 5. @manual-testing-agent  
- **Validates real APIs match shared mocks**
- Tests all scenarios manually to catch integration issues

### 6. @playwright-testing-agent
- **Creates E2E tests using same shared mocks**
- Automates all user scenarios for regression protection

## Shared Mock Testing Strategy

**The Innovation**: One mock definition, all tests synchronized.

```typescript
// lib/test-mocks.ts - Single source of truth
export const apiMocks = {
  profile: {
    update: {
      request: { name: "John Doe", email: "john@example.com" },
      response: { success: true, user: { id: 1, name: "John Doe" } }
    }
  }
};

// Jest unit tests use these mocks
// Playwright E2E tests use same mocks  
// Zero mock drift possible!
```

## Success Indicators

### ✅ Implementation Complete When:
- All bullet point scenarios implemented and working
- Spec header marked complete: ☐ → ☑  
- TypeScript compiles without errors
- All Jest unit tests pass
- All Playwright E2E tests pass
- Manual testing confirms real APIs work

### 🔍 Quality Checks:
```bash
npm run typecheck    # TypeScript validation
npm run test         # Jest unit tests  
npm run test:e2e     # Playwright E2E tests
npm run lint         # Code style check
```

## File Structure

```
docs/
└── specs.md                    # Single specs file (you manage)

lib/
└── test-mocks.ts              # Shared mock contracts (agents create)

tests/
├── unit/                      # Jest unit tests (jest-agent creates)
│   ├── api/                  # API route tests
│   └── components/           # Component tests  
└── e2e/                      # Playwright E2E tests (playwright-agent creates)
    ├── utils/mock-manager.ts # Mock setup utility
    └── *.spec.ts            # E2E test files

app/                          # Next.js app (backend/frontend agents create)
components/                   # React components (frontend-agent creates)
```

## Development Logs

- **Current session**: `logs/dev.log` - real-time server output for debugging
- **Previous sessions**: `logs/dev-{timestamp}.log` - archived logs

## Best Practices

### Writing Good Specs
- **Focus on user value** - What does the user accomplish?
- **Be specific** - "User clicks save button" not "User saves data"  
- **Include realistic data** - Use actual email formats, names
- **Cover key error cases** - What validation errors matter?
- **Keep scenarios focused** - 2-4 scenarios per spec typically

### Managing Project Evolution  
- **Reference replaced features** - "NOTE: Replaces spec 012 with better UX"
- **Keep old specs for reference** - Mark them ☑ but don't delete
- **Use WHY for context** - Help future developers understand decisions
- **Use NOTE for constraints** - Technical limitations, dependencies

This system is designed to be **fast, reliable, and maintainable** - letting you focus on product decisions while agents handle implementation details.