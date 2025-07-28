# Implement Feature Specification: $ARGUMENTS

Execute the 6-agent development workflow for unchecked scenarios in spec(s) $ARGUMENTS.

**Usage Examples:**

- `/implement-spec 015` - Implement all bullet point scenarios in spec 015
- `/implement-spec 015-018` - Implement all scenarios in specs 015, 016, 017, 018
- `/implement-spec 015,017,020` - Implement specific specs 015, 017, and 020

## Implementation Process

### Step 1: Parse and Validate

- **Parse spec numbers** from $ARGUMENTS (single, range, or list)
- **Read specs file** (`docs/specs.md`) and locate specified specs
- **Identify incomplete specs** (☐) that need implementation
- **Skip completed specs** (☑) - no rework needed
- **Parse bullet point scenarios** vs WHY/NOTE context lines

### Step 2: 6-Agent Workflow (Per Spec)

For each incomplete spec (☐):

#### Phase 1: Planning & Analysis

Use @planning-agent to analyze and plan:

- Read bullet point scenarios and WHY/NOTE context
- **Distinguish scenarios (bullet points) from context (WHY/NOTE lines)**
- Analyze existing codebase for integration points
- **Create/update shared mock contracts** in `lib/test-mocks.ts`
- Create implementation plan for remaining agents
- Document dependencies and risks

#### Phase 2: Backend Implementation

Use @backend-agent to implement server-side:

- **Implement shared mock contracts** exactly as designed
- Create API routes matching shared mock structure
- Follow implementation plan from planning phase
- Test APIs manually to verify they match shared mocks

#### Phase 3: Unit Testing

Use @jest-agent to create comprehensive tests:

- **Create Jest unit tests using shared mock data**
- Test API routes and any reusable components
- Ensure all success and failure scenarios covered
- Verify tests pass with shared mock integration

#### Phase 4: Frontend Implementation

Use @frontend-agent to build UI:

- **Use shared mock contracts** for data structure understanding
- Create components with proper data-testid attributes
- Implement forms with validation matching shared mock rules
- Test manually in browser to verify integration

#### Phase 5: Manual Integration Testing

Use @manual-testing-agent to validate:

- **Test real APIs match shared mock contracts exactly**
- Manually verify all unchecked scenarios work end-to-end
- Test responsive design and accessibility
- Document any integration issues found

#### Phase 6: E2E Test Automation

Use @playwright-testing-agent to automate:

- **Create E2E tests using shared mocks** from `lib/test-mocks.ts`
- Use APIMockManager for consistent mock setup
- Map each user scenario to automated test
- Verify all tests pass consistently

### Step 3: Progress Tracking

When spec implementation is complete:

- **Mark spec complete**: ☐ → ☑
- **Commit changes** with descriptive message

### Step 4: Quality Verification

Before marking spec complete:

- Run `npm run typecheck` - TypeScript compiles without errors
- Run `npm run test` - Jest unit tests pass with shared mocks
- Run `npm run test:e2e` - Playwright tests pass with shared mocks
- Verify manual testing confirmed real APIs match shared mocks

## Shared Mock Testing Benefits

This workflow ensures:

- ✅ **Zero mock drift** - Unit and E2E tests use identical contracts
- ✅ **Fast development** - Clear handoffs between agents
- ✅ **Reliable testing** - Deterministic shared mock data
- ✅ **Contract validation** - Real APIs verified against mocks

## Example Execution

```markdown
# Before implementation:

## ☐ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully
- User sees validation error for invalid email format

# After /implement-spec 015:

## ☑ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully
- User sees validation error for invalid email format
```

## When to Stop and Ask

- Spec scenarios are unclear or conflicting
- WHY/NOTE context suggests missing requirements
- Existing codebase conflicts prevent implementation
- Shared mock contracts need clarification
- Integration dependencies not yet available

## Range/List Processing

For multiple specs:

- **Process in order** specified (015, 016, 017, 018)
- **Stop if any spec fails** - don't continue to next spec
- **Report progress** - which specs completed successfully
- **Handle dependencies** - skip specs that depend on failed specs

This command is designed to handle anything from single features to entire project milestones efficiently and reliably.
