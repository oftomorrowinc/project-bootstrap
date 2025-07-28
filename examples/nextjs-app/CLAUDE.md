# Agent-Driven Development Project

## CRITICAL: DEV SERVER POLICY

**🚫 NEVER RUN DEV SERVER COMMANDS 🚫**

The developer ALWAYS runs the development server manually and keeps it running.

**FORBIDDEN COMMANDS:**

- `npm run dev`
- `npm start`
- `yarn dev`
- `pnpm dev`
- Any command that starts a development server

**FOR DEBUGGING:** View current development logs at `logs/dev.log` - this contains real-time server output for troubleshooting.

**THIS APPLIES TO ALL AGENTS AND ALL CONTEXTS - NO EXCEPTIONS**

## Development Workflow

### Quality Checks (Run Before Completion)

Before saying changes are complete, run these checks:

```bash
npm run format
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```

### Simple Specs-Based Development

**Core Process:**

1. **Read specs file** (`docs/specs.md`) - single file with all features
2. **Implement unchecked scenarios** (☐) using 6-agent workflow
3. **Check off completed scenarios** (☐ → ☑) as implementation progresses
4. **Mark spec complete** (☐ → ☑) when all scenarios done

### Available Commands

- `/implement-spec 015` - Implement all bullet point scenarios in spec 015
- `/implement-spec 015-018` - Implement specs 015, 016, 017, 018 in sequence
- `/implement-spec 015,017,020` - Implement specific specs in order
- `/quick-implement 015` - Rapid prototype with minimal testing
- `/create-spec 025` - Generate new spec template

## Specs File Format

### Single Source: `docs/specs.md`

```markdown
## ☐ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully
- User sees validation error for invalid email format

WHY: Users need to manage their account information
DEPENDS: 012
NOTE: Keep form simple, can add avatar upload later
```

### Format Rules

- **Spec header**: `## [CHECKBOX] Spec [NUMBER]: [FEATURE NAME]`
- **Scenarios**: `- User [action], [result]` - standard bullet points
- **Context**: `WHY:`, `DEPENDS:`, and `NOTE:` lines provide context (not scenarios)
- **Dependencies**: `DEPENDS: 015` format enables parallel execution optimization
- **Progress**: Agents mark spec complete (☐ → ☑) when all scenarios implemented

## Shared Mock Testing Strategy

**Core Innovation**: One mock definition, all tests synchronized.

```typescript
// lib/test-mocks.ts - Single source of truth
export const apiMocks = {
  profile: {
    update: {
      request: { name: 'John Doe', email: 'john@example.com' },
      response: { success: true, user: { id: 1, name: 'John Doe' } },
    },
  },
};

// Jest unit tests use shared mocks
// Playwright E2E tests use same shared mocks
// Zero mock drift possible!
```

## Technology Stack

- **Framework**: Next.js 15+ with App Router
- **UI**: shadcn/ui components + Tailwind CSS
- **Forms**: react-hook-form + Zod validation
- **Database**: Firestore with native Firebase libraries (frontend implementation)
- **Authentication**: Firebase Auth with Google Login
- **File Storage**: Firebase Storage
- **Backend APIs**: External services, file system operations, server-only tasks
- **Testing**: Jest (unit) + Playwright (E2E) with shared mocks from `lib/test-mocks.ts`

## Project Structure

```
docs/
└── specs.md                   # Single specs file (all features)

lib/
└── test-mocks.ts              # Shared mock contracts (agents create)

tests/
├── unit/                      # Jest unit tests using shared mocks
│   ├── api/                  # API route tests
│   └── components/           # Component tests
└── e2e/                      # Playwright E2E tests using shared mocks
    ├── utils/mock-manager.ts # Mock setup utility
    └── *.spec.ts            # E2E test files

logs/                         # Development server logs
├── dev.log                  # Current session (real-time)
└── dev-{timestamp}.log      # Previous sessions (archived)

app/                         # Next.js app directory
components/                  # React components
src/                        # Source code
public/                     # Static assets
scripts/                    # Utility scripts
```

## Agent Responsibilities (6-Agent Workflow)

### @planning-agent

- Analyzes specs and reviews existing codebase
- **Creates shared mock contracts** in `lib/test-mocks.ts`
- Creates comprehensive implementation plans
- Identifies dependencies and integration points

### @backend-agent

- Implements API routes matching shared mock contracts exactly
- Creates server-side functionality and database operations
- Follows implementation plans from @planning-agent

### @jest-agent

- **Creates Jest unit tests** using shared mock data
- Tests API routes and React components with mock integration
- Ensures comprehensive coverage (success + failure cases)

### @frontend-agent

- **Uses shared mock contracts** for data structure clarity
- Implements UI components and client-side functionality
- Builds forms with validation matching shared mock rules

### @manual-testing-agent

- **Validates real APIs match shared mock contracts**
- Manual verification of acceptance criteria
- Cross-browser and responsive testing
- Integration testing without mocks

### @playwright-testing-agent

- **Creates E2E tests using shared mocks** from `lib/test-mocks.ts`
- Uses APIMockManager for consistent mock setup
- Maps user scenarios to automated tests

## Code Standards

- **TypeScript**: Strict mode, no `any` types
- **API Routes**: Return `{success: boolean, data?: any, error?: string}`
- **Validation**: Zod schemas for all data validation
- **Components**: Use shadcn/ui consistently with proper data-testid attributes
- **Database**: Use Firestore in frontend components, not backend APIs
- **Shared Mocks**: All API contracts defined in `lib/test-mocks.ts`
- **Testing**: 100% shared mock integration - zero mock drift

## Implementation Process

### Simple Progress Tracking

```markdown
# Before implementation:

## ☐ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully

# After completion:

## ☑ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully
```

### Shared Mock Workflow

1. **@planning-agent** creates mock contracts in `lib/test-mocks.ts`
2. **@backend-agent** implements APIs matching mock contracts exactly
3. **@jest-agent** creates unit tests using shared mock data
4. **@frontend-agent** builds UI using shared mock data structures
5. **@manual-testing-agent** validates real APIs match shared mocks
6. **@playwright-testing-agent** creates E2E tests using same shared mocks

### Critical Testing Requirements

**API Mocking Setup Order (MANDATORY):**

```typescript
// CORRECT: Set up mocks BEFORE navigation
test.beforeEach(async ({ page }) => {
  const mockManager = new APIMockManager(page);
  await mockManager.setupAllMocks();

  // NOW safe to navigate
  await page.goto('/');
});
```

## Common Commands

- `npm run dev`: Start development server with logging to `logs/dev.log`
- `npm run build`: Build the app for production
- `npm run typecheck`: Check TypeScript types
- `npm run test`: Run Jest unit tests
- `npm run test:e2e`: Run Playwright E2E tests
- `npm run test:all`: Run both unit and E2E tests
- `npm run lint`: Check code style with ESLint
- `npm run format`: Format code with Prettier

## Firebase Integration

The app uses Firebase services:

- **Authentication**: Firebase Auth with Google Login
- **Database**: Firestore (primarily frontend implementation)
- **Storage**: Firebase Storage
- **Hosting**: Firebase App Hosting for deployment

SSR is disabled by default since this is primarily a client-side app.

## Development Debugging

### Server Logs

- **Current session**: `logs/dev.log` - real-time development server output
- **Previous sessions**: `logs/dev-{timestamp}.log` - archived logs
- Use these logs for debugging server issues, API problems, or build errors

### Testing Logs

- Jest: `npm run test -- --verbose` for detailed output
- Playwright: `npx playwright test --ui` for interactive debugging

## When to STOP and Ask

- Spec scenarios are unclear or conflicting
- Shared mock contracts conflict with existing patterns
- Technical approach needs architecture decision
- Dependencies missing or blocking implementation
- Real API behavior differs from shared mock contracts

## Success Criteria

- All bullet point scenarios implemented and working
- Spec header marked complete: ☐ → ☑
- TypeScript compiles without errors
- Jest unit tests pass with shared mock data
- Playwright E2E tests pass with same shared mock data
- No mock drift between test types
- Responsive design works on mobile/tablet/desktop
- Code follows project standards and patterns

## Benefits of This System

- ✅ **Simple workflow** - Single specs file, checkbox progress tracking
- ✅ **Zero mock drift** - Unit and E2E tests use identical data contracts
- ✅ **Fast development** - Clear handoffs between specialized agents
- ✅ **Reliable testing** - Deterministic shared mock data
- ✅ **Easy maintenance** - Update one file, all tests stay synchronized
- ✅ **Visual progress** - Watch features get completed in real-time
- ✅ **Comprehensive coverage** - 6-agent workflow ensures quality at every step
