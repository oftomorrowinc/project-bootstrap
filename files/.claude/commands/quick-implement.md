# Quick Implementation with Minimal Shared Mocks: $ARGUMENTS

Rapid implementation workflow for simple features or prototypes with essential shared mock setup.

Use this for:
- Simple features with minimal risk
- Prototype/proof-of-concept development
- Internal tools with low complexity
- Features that will be heavily iterated

## Phase 1: Quick Planning

Use @planning-agent for minimal analysis:
- Read spec-$ARGUMENTS.md for core requirements
- **Create basic shared mock contracts** in `lib/test-mocks.ts` for primary scenarios only
- Identify major integration points
- Create simple implementation plan

## Phase 2: Backend Implementation

Use @backend-agent to create server-side functionality:
- **Implement minimal shared mock contracts** for primary user scenarios
- Implement minimal viable backend APIs matching mock contracts
- Basic error handling only (no comprehensive edge cases)
- Update spec with API details and essential mock contracts

## Phase 3: Basic Unit Testing

Use @jest-agent for essential testing:
- **Create basic Jest tests** using shared mock data for happy path
- Test primary API endpoint functionality
- Skip comprehensive edge case testing
- Update spec with basic test coverage

## Phase 4: Frontend Implementation  

Use @frontend-agent to build basic UI:
- **Review minimal shared mock contracts** for data structure understanding
- Create functional components using established patterns
- Connect to backend APIs using shared mock contract structure
- Minimal styling and responsive design
- Update spec with component details

## Phase 5: Basic Verification

Use @manual-testing-agent for essential verification:
- Test primary user flow only (from spec scenarios)
- Verify real APIs match minimal shared mock contracts
- Document any critical issues that block usage
- Update spec with basic verification results

## Skip for Quick Implementation
- Comprehensive edge case testing
- Full E2E test automation (can add with `/add-testing` later)
- Extensive validation scenarios
- Cross-browser testing

## Minimal Shared Mock Benefits

Even in quick mode, shared mocks provide:
- ✅ **Clear contracts** between frontend and backend
- ✅ **Basic test foundation** for future expansion
- ✅ **Reduced integration bugs** through contract definition
- ✅ **Easy upgrade path** to full testing when needed

## Add Comprehensive Testing Later

When feature is ready for production:
```bash
/add-testing $ARGUMENTS
```

## Timeline

This workflow should complete in 60-90 minutes for typical features:
- **Phase 1**: 10-15 minutes (quick planning + minimal mocks)
- **Phase 2**: 20-30 minutes (basic backend + mock implementation)
- **Phase 3**: 10-15 minutes (basic unit tests)
- **Phase 4**: 20-30 minutes (functional UI)  
- **Phase 5**: 10-15 minutes (basic verification)

Perfect for rapid prototyping while maintaining the foundation for future comprehensive testing.