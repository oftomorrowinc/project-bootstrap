# Create New Feature Specification: $ARGUMENTS

Generate a new specification template for feature development.

## Specification Template

Create docs/specs/spec-$ARGUMENTS.md with this structure:

````markdown
# Spec $ARGUMENTS: [Feature Name]

## Context & Goals

[Why this feature is needed and what success looks like]

## Gherkin Specifications

```gherkin
Feature: [Feature Name]
  Background:
    Given [common setup for all scenarios]

  Scenario: [Primary happy path]
    Given [context]
    When [user action]
    Then [expected outcome]

  Scenario: [Key error case]
    Given [context]
    When [error condition]
    Then [error handling]
```
````

## Key Implementation Notes

- [Critical UI/UX requirements]
- [Technical constraints or libraries to use]
- [Edge cases or error scenarios]
- [Mobile/accessibility considerations]

## Implementation Results (Added by Agents)

_This section gets populated during implementation_

```

## Next Steps
1. Fill in the specification details
2. Review with stakeholders if needed
3. Run `/implement-spec $ARGUMENTS` to begin implementation
4. Iterate based on testing and feedback

## Specification Guidelines
- Keep Gherkin scenarios focused on user value
- Include 2-4 key scenarios covering happy path and main error cases
- Add implementation notes for critical details
- Avoid over-specifying technical implementation details
- Focus on what and why, let agents determine how

Remember: simpler specs lead to faster, more focused implementation.
```
