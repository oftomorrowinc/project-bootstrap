# Spec Template

## ☐ Spec XXX: [Feature Name]

- [Primary user scenario - describe the main happy path with specific actions and outcomes]
- [Key validation scenario - describe main error case with specific validation rules]  
- [Additional scenario - describe edge case or secondary flow if needed]
- [Optional fourth scenario - only if essential to feature completeness]

WHY: [Brief explanation of why this feature is needed and the user value it provides]
DEPENDS: [Optional - spec number if this feature requires another spec to be completed first]
NOTE: [Optional - implementation hints, constraints, technical notes, or future considerations]

---

## Writing Guidelines

### Good Scenario Examples ✅

**Login Success**: User clicks login button in header, enters "test@example.com" and "password123", clicks submit, sees loading state, then redirects to dashboard with "Welcome back!" message.

**Email Validation**: User clicks login button, enters "invalid-email" in email field, clicks submit, sees "Please enter a valid email address" error below email field.

**Profile Update**: User opens profile settings, changes name from "John" to "John Smith", clicks save, sees "Profile updated successfully" message.

### Avoid These Patterns ❌

- **Too vague**: "User does login stuff and it works"
- **Too technical**: "System validates JWT token and updates database records"  
- **Too complex**: "User navigates through multi-step wizard with validation at each step"

### Scenario Best Practices

#### Be User-Focused
- **Start with "User"** - keeps focus on user experience
- **Describe what user sees** - "sees success message", "gets redirected to dashboard"
- **Use realistic data** - "enters john@example.com" instead of "enters email"

#### Be Specific but Concise
- **Include specific actions** - "clicks save button" not "saves data"
- **Show clear outcomes** - "sees 'Settings updated' message" not "operation completes"
- **Use actual UI text** - exact error messages, button labels, page titles

#### Cover Key Scenarios
- **Happy path** - primary successful user flow (always include)
- **Validation errors** - what happens with invalid input (usually include)
- **Edge cases** - empty states, error conditions (include if critical)
- **Keep it focused** - 2-4 scenarios per spec typically

### Spec Size Guidelines

**Target: 2-4 hours implementation time per spec**

- **Small (1-2 hours)**: 2-3 simple scenarios, minimal UI
- **Medium (2-4 hours)**: 3-4 scenarios, standard forms or CRUD operations  
- **Large (4+ hours)**: 5+ scenarios - consider splitting into multiple specs

### Context Lines

#### WHY Examples
```markdown
WHY: Users need quick access to recent work for productivity
WHY: Support team needs visibility into user account status
WHY: Users frequently lose work without auto-save capability
```

#### DEPENDS Usage
```markdown
DEPENDS: 015    # This spec requires spec 015 to be completed first
# No DEPENDS line = no dependencies, can run in parallel
```

#### NOTE Examples  
```markdown
NOTE: Start with basic upload, can add drag-drop later
NOTE: Keep mobile-first design for touch interfaces
NOTE: Use existing design system components for consistency
NOTE: Performance critical - should load under 2 seconds
```

### Common Spec Patterns

#### Authentication Flows
```markdown
- User enters valid credentials, gets authenticated, redirects to dashboard
- User enters invalid credentials, sees "Invalid email or password" error
- User clicks "Forgot Password", enters email, sees "Reset link sent" message
```

#### CRUD Operations
```markdown
- User fills form with valid data, clicks create, sees new item in list
- User edits existing item, saves changes, sees updated data
- User clicks delete, confirms in dialog, sees item removed from list
```

#### Form Interactions
```markdown
- User completes required fields, submits successfully, sees confirmation
- User submits with missing email, sees "Email is required" error
- User sees loading indicator during submission, then success message
```

#### Data Display
```markdown
- User navigates to page, sees loading state, then data appears properly formatted
- User views empty list, sees "No items yet" with helpful call-to-action
- User encounters loading error, sees "Failed to load" with retry button
```

## Implementation Results

*This section gets automatically populated by the 6-agent workflow during implementation*

### Planning (@planning-agent)
- Codebase analysis and integration points
- Shared mock contracts created in `lib/test-mocks.ts`
- Implementation plan and risk assessment

### Backend (@backend-agent)
- API endpoints matching planned contracts
- Database changes and authentication logic

### Unit Testing (@jest-agent)
- API and component tests using shared mocks
- Test coverage and pass rates

### Frontend (@frontend-agent)
- UI components with proper validation
- Responsive design implementation

### Manual Testing (@manual-testing-agent)
- Real API validation against mock contracts
- Browser compatibility and integration testing

### E2E Testing (@playwright-agent)
- Automated tests using shared mock data
- End-to-end scenario coverage

---

## Key Principles

1. **User scenarios drive everything** - Write from user perspective
2. **Keep specs small** - Target 2-4 hours implementation each
3. **Be specific and concrete** - Avoid vague language
4. **Focus on value** - Use WHY to explain user benefit
5. **Enable parallel execution** - Use DEPENDS only when necessary
6. **Shared mock testing** - One mock definition, all tests synchronized