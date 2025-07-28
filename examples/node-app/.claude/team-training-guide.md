## For Claude Chat Context (Spec Building)

When working with Claude Chat to build specs, provide this context to get better results:

### **Spec Size Preferences**

- **Target 2-4 hours implementation time** per spec
- **Prefer multiple small specs** over one large spec
- **Split complex features** into logical chunks (auth → profile → settings)
- **Use size guidelines**: 2-3 bullets = small, 3-5 bullets = medium, 5+ = consider splitting

### **Dependency Planning**

- **Use formal DEPENDS line** for blocking relationships (DEPENDS: 015)
- **Omit DEPENDS if independent** - enables parallel execution
- **Note if spec needs authentication** (most user features depend on auth spec)
- **Note if spec needs data from other specs** (user profile needs user registration)
- **Call out specs that are independent** (public pages, admin tools, static content)

### **Implementation Context**

- **Existing codebase patterns** you want to follow
- **UI library preferences** (we use shadcn/ui + Tailwind)
- **Technical constraints** (mobile-first, accessibility requirements)
- **Performance considerations** (page load speed, database queries)
- **Authentication requirements** (which specs need users to be logged in)

### **Quality Expectations**

- **Shared mock testing** will be used (unit + E2E tests with same data)
- **Manual testing** will verify real APIs match mocks
- **Responsive design** required for mobile/tablet/desktop
- **Error handling** should be user-friendly with clear messages
- **6-agent workflow** will implement with comprehensive testing

### **Project Context Information**

Provide details about:

- **Current project state** (what specs are already complete)
- **Technology stack** (Next.js, Firebase, specific libraries)
- **User types** (authenticated users, admins, public visitors)
- **Data relationships** (how features connect to existing data)
- **Business priorities** (which features are most critical)

### **Useful Prompting Phrases**

Use these phrases when asking Claude Chat for help:

**For Breaking Down Large Features:**

- "Break this into 2-4 hour specs with clear dependencies"
- "Split this feature logically - which parts can run in parallel?"
- "What specs need authentication vs which can be public?"

**For Dependency Clarity:**

- "Which of these specs depend on user login (spec 015)?"
- "Can any of these specs run independently in parallel?"
- "What's the minimum dependency chain for this feature set?"

**For Size Validation:**

- "Are any of these specs too large? Should we split them?"
- "Each spec should take 2-4 hours - how do these look?"
- "Which specs are good size vs need breaking down?"

**For Context Setting:**

- "This app uses Firebase auth, Next.js, and shadcn/ui components"
- "Users need to be logged in for personalized features"
- "Focus on mobile-first responsive design"
- "Prioritize clear error messages and loading states"

**Example Context for Claude Chat:**

```
"Help me write specs for a user dashboard feature. Break it into 2-3 small specs (2-4 hours each). The app uses Next.js with shadcn/ui components. Users need to be authenticated to access dashboard (depends on spec 015). Focus on mobile-first design. Each spec should have 2-4 user scenarios and clear DEPENDS lines where needed. Split into: dashboard overview, recent activity, and quick actions."
```

### **Common Spec Patterns**

Ask Claude Chat to use these proven patterns:

**Authentication Flow:**

```markdown
- User enters credentials, gets authenticated
- User sees validation error for invalid input
- User gets redirected to intended page after login
```

**CRUD Operations:**

```markdown
- User creates new [item], sees success confirmation
- User edits existing [item], saves changes successfully
- User deletes [item] with confirmation dialog, sees removal
```

**Form Interactions:**

```markdown
- User fills required fields, submits successfully
- User sees validation errors for missing/invalid fields
- User sees loading state during submission
```

**Data Display:**

```markdown
- User sees [data] loaded and properly formatted
- User sees helpful empty state when no data exists
- User sees error message when data fails to load
```

### **What Makes Specs Implementation-Ready**

Help Claude Chat understand these requirements:

- **Specific user actions** - "clicks save button" not "saves data"
- **Clear outcomes** - "sees success message" not "operation completes"
- **Realistic data** - "enters john@example.com" not "enters email"
- **Error scenarios** - what validation errors are possible
- **UI state feedback** - loading indicators, progress bars, confirmations

This context helps Claude Chat write specs that the 6-agent workflow can implement efficiently with comprehensive testing.# Team Training: Agent-Driven Development System

## What This System Does

**In 30 seconds**: You write user scenarios in a simple checklist format. Claude Code implements them automatically using 6 specialized agents and comprehensive testing. Features are built fast, tested thoroughly, and work reliably.

**Key Innovation**: Shared mock contracts keep all tests synchronized - no more mock drift between unit and E2E tests.

## Prerequisites

- Project already set up with agent system
- Claude Code installed and working
- Basic understanding of user story writing

## The Specs File Format

### Location

All features live in one file: `docs/specs.md`

### Basic Structure

```markdown
## ☐ Spec 015: User Profile Settings

- User clicks profile menu, opens settings page
- User updates name and email, saves changes successfully
- User sees validation error for invalid email format

WHY: Users need to manage their account information
NOTE: Keep form simple, can add avatar upload later
```

### Format Rules

#### Spec Header

```markdown
## [CHECKBOX] Spec [NUMBER]: [FEATURE NAME]
```

- **Checkbox**: ☐ (incomplete) or ☑ (complete)
- **Number**: Sequential (015, 016, 017...)
- **Name**: Clear, descriptive feature name

#### User Scenarios

```markdown
- User [action], [result]
- User [different action], [different result]
```

- **Standard bullet points** - no checkboxes on individual scenarios
- **Use "User"** to begin each scenario
- **Be specific**: "User clicks save button" not "User saves"
- **Include outcome**: what the user sees or what happens

#### Context Lines (Optional)

```markdown
WHY: [Why this feature matters to users]
DEPENDS: [Spec number this feature requires to be completed first]
NOTE: [Implementation hints, constraints, dependencies]
```

- **WHY**: Business value, user benefit, or problem being solved
- **DEPENDS**: Spec number that must be completed before this one (enables parallel execution)
- **NOTE**: Technical constraints, design decisions, or future considerations
- **No bullet points** on context lines - these provide background, not scenarios

## Writing Good Specs

### ✅ Good Examples

```markdown
## ☐ Spec 020: Project Search

- User types in search box, sees filtered project list update in real-time
- User searches for "test", sees only projects containing "test" in name or description
- User clears search, sees full project list restored

WHY: Users with many projects need to find them quickly
DEPENDS: 018
NOTE: Search should be case-insensitive and include both name and description
```

### ❌ Avoid These Patterns

```markdown
# Too vague

☐ User does search stuff and it works

# Too technical

☐ System queries database with SQL LIKE operator for matching records

# Too many actions in one scenario

☐ User opens search, types query, filters results, sorts by date, exports to CSV
```

### Writing Guidelines

#### Be User-Focused

- **Start with "User"** - keeps focus on user experience
- **Describe what user sees** - "sees success message", "gets redirected to dashboard"
- **Use realistic data** - "enters john@example.com" instead of "enters email"

#### Be Specific but Not Technical

- **Good**: "User clicks save button, sees 'Settings updated successfully' message"
- **Avoid**: "User triggers API call to update user profile endpoint"

#### Cover Key Scenarios

- **Happy path** - primary successful user flow
- **Validation errors** - what happens with invalid input
- **Edge cases** - empty states, error conditions, boundary cases

#### Keep Scenarios Focused

- **One user action** per scenario typically
- **2-4 scenarios** per spec usually sufficient
- **Break large features** into multiple specs if needed

#### Spec Size Guidelines

- **Small spec (1-2 hours)**: 2-3 simple bullet points, minimal UI
- **Medium spec (2-4 hours)**: 3-5 bullet points, standard CRUD or form
- **Large spec (4+ hours)**: 5+ bullet points, complex interactions, integrations
- **Too large**: If >6 bullet points or involves multiple user flows, consider splitting

**Examples:**

```markdown
# Small spec (perfect size)

## ☐ Spec 025: Export Project Data

- User clicks export button, downloads PDF summary
- User sees progress indicator during generation

# Medium spec (good size)

## ☐ Spec 026: Project Search

- User types in search box, sees filtered results in real-time
- User filters by project type using dropdown
- User clears search, sees full project list restored
- User searches with no results, sees helpful empty state

# Too large (should split)

## ☐ Spec 027: Complete Project Management

- User creates project with details and settings
- User invites team members via email
- User assigns tasks to team members
- User tracks project progress with charts
- User exports project reports in multiple formats
- User archives completed projects
```

#### Dependencies and Parallel Execution

- **Use DEPENDS for blocking relationships**: "DEPENDS: 015" means spec 015 must be completed first
- **Omit DEPENDS if no dependencies**: Specs without dependencies can run in parallel
- **Enable optimization**: Helps Claude Code run multiple specs simultaneously using Git Worktrees

**Dependency Examples:**

```markdown
## ☐ Spec 015: User Authentication

WHY: Foundation for all user-specific features

# No DEPENDS line = no dependencies, can run in parallel

## ☐ Spec 016: User Dashboard

WHY: Users need personalized home page after login
DEPENDS: 015

## ☐ Spec 017: Public Project Gallery

WHY: Marketing and discovery for non-users

# No DEPENDS line = can run in parallel with auth features

## ☐ Spec 018: Project Creation

WHY: Core feature for authenticated users
DEPENDS: 015
```

**Parallel Execution Result:**

```bash
/implement-spec 015-018
# Track 1: 015 → 016 (sequential due to dependency)
# Track 2: 017 (parallel, no dependencies)
# Track 3: 018 waits for 015, then runs
```

## Using WHY and NOTE

### WHY Examples

```markdown
WHY: Users need quick access to recent work for productivity
WHY: Compliance requires audit trail of all user actions  
WHY: Users frequently lose work without auto-save capability
WHY: Support team needs visibility into user account status
```

### NOTE Examples

```markdown
NOTE: Start with basic upload, can add drag-drop later
NOTE: Requires completion of authentication system (spec 012)
NOTE: Keep mobile-first design for touch interfaces
NOTE: Use existing design system components for consistency
NOTE: Performance critical - should load under 2 seconds
```

## Implementation Process

### 1. Add Your Spec

Edit `docs/specs.md` and add your new feature:

```markdown
## ☐ Spec 025: File Export

- User clicks export button, selects PDF format, downloads project summary
- User selects CSV format, downloads project data spreadsheet
- User sees progress indicator during export generation

WHY: Users need to share project data with external stakeholders
DEPENDS: 018
NOTE: Start with PDF and CSV, can add other formats based on demand
```

### 2. Run Implementation

```bash
/implement-spec 025
```

### 3. Watch Progress

Claude Code will:

- ✅ Analyze your spec and create implementation plan
- ✅ Build backend APIs with shared mock contracts
- ✅ Create comprehensive unit tests
- ✅ Build frontend components
- ✅ Validate with manual testing
- ✅ Create automated E2E tests
- ✅ Mark spec complete: ☐ → ☑

### 4. Verify Results

Check that:

- All scenarios are checked off: ☑
- Spec header is marked complete: ☑
- Feature works as described in browser
- Tests pass: `npm run test && npm run test:e2e`

## Common Commands

### Single Spec

```bash
/implement-spec 025     # Implement spec 025
```

### Multiple Specs

```bash
/implement-spec 025-028 # Implement specs 025, 026, 027, 028 in order
/implement-spec 025,027,030 # Implement specific specs in order
```

### Quick Prototyping

```bash
/quick-implement 025    # Fast implementation with minimal testing
```

### Create New Spec Template

```bash
/create-spec 030       # Generate template for spec 030
```

## Managing Feature Evolution

### Replacing Features

When a new approach replaces an old one:

```markdown
## ☑ Spec 015: Simple File Upload

- User uploads single file via button
- User sees upload progress

WHY: Users needed basic file upload capability
NOTE: Completed - replaced by spec 023 with drag-drop interface

---

## ☐ Spec 023: Advanced File Upload

- User drags multiple files to upload area
- User sees thumbnail previews before uploading
- User removes files from queue before submitting

WHY: Better UX for file uploads with multiple file support
NOTE: Replaces spec 015 with modern drag-drop interface
```

**Key Points:**

- **Keep old spec** for reference (marked ☑)
- **Add NOTE** explaining what replaced it
- **Create new spec** with improved approach
- **Reference old spec** in new spec's NOTE

### Updating Existing Features

For small updates, add scenarios to existing spec:

```markdown
## ☐ Spec 020: Project Search

- User types in search box, sees filtered results
- User searches for "test", sees matching projects
- User filters by project type (new requirement)
- User sorts search results by date created (new requirement)

WHY: Users need to find projects quickly
NOTE: Added filtering and sorting based on user feedback
```

## Troubleshooting

### Spec Not Implementing Correctly

1. **Check scenario clarity** - Is it specific enough?
2. **Review WHY/NOTE** - Do they provide enough context?
3. **Check dependencies** - Does it depend on other incomplete specs?
4. **Look at logs** - Check `logs/dev.log` for errors

### Tests Failing

1. **Run quality checks**:
   ```bash
   npm run typecheck
   npm run test
   npm run test:e2e
   ```
2. **Check shared mocks** - Look at `lib/test-mocks.ts` for contract issues
3. **Manual testing** - Try the feature in browser to isolate issues

### Feature Partially Complete

- **Spec marked incomplete ☐** - Normal, run `/implement-spec` again if needed
- **Spec stuck in progress** - Review logs and ask Claude Code to debug specific issues

## Team Collaboration

### File Management

- **One person edits** `docs/specs.md` at a time to avoid conflicts
- **Communicate** when adding new specs to avoid numbering conflicts
- **Review specs** before implementation to catch issues early

### Spec Review Process

1. **Product owner** writes spec with WHY context
2. **Technical lead** reviews NOTE for feasibility
3. **Team** discusses unclear scenarios
4. **Developer** runs implementation when ready

### Project Planning

- **Group related specs** (015-020 might be "user management" features)
- **Use WHY** to maintain focus on user value
- **Reference dependencies** in NOTE sections
- **Plan iterations** around logical spec groupings

## Benefits You'll See

### Development Speed

- **2-3 hours** from spec to working feature with full testing
- **No context switching** - write spec, Claude Code handles implementation
- **Fewer bugs** - comprehensive testing built into every feature

### Code Quality

- **Consistent patterns** - agents follow established conventions
- **100% test coverage** - unit and E2E tests for every scenario
- **Zero mock drift** - shared contracts keep tests synchronized

### Team Alignment

- **Clear requirements** - scenarios are unambiguous
- **Living documentation** - specs stay current with implementation
- **Shared understanding** - WHY provides context for decisions

This system transforms feature development from weeks to hours while maintaining high quality and comprehensive testing. Focus on **what** users need, and let the agents handle **how** to build it.
