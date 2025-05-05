# CLAUDE.md

## Project: node-app

This file provides guidelines for AI assistants working with this codebase.

## Development Workflow

1. Before saying changes are complete, run the following checks:

   ```
   npm run format
   npm run typecheck
   npm run lint
   npm run test
   ```

2. Do not run emulator or server:

```
Developer will run `npm run dev` and `npm run emulators`
Ask developer for output when need
Ask developer to restart server or emulator as needed
```

3. Use the curl helper for local API requests:

   ```
   npm run curl api/users
   npm run curl -X POST -H "Content-Type: application/json" -d '{"username":"test"}' api/auth/login
   ```

4. When adding new features:
   - Add appropriate tests
   - Update documentation
   - Follow the established code style

## Project Structure

- `src/`: Source code
  - `controllers/`: Route handlers
  - `models/`: Data models
  - `middleware/`: Express middleware
  - `views/`: Pug templates
  - `public/`: Static assets
  - `utils/`: Utility functions
- `dist/`: Compiled JavaScript
- `tests/`: Test files
- `scripts/`: Utility scripts

## Common Commands

- `npm run typecheck`: Check TypeScript types
- `npm run test`: Run Jest and Playwright tests
  = `npm run test:unit`: Run Jest tests
- `npm run test:e2e`: Run Playwright end-to-end tests
- `npm run lint`: Check code style
- `npm run format`: Format code with Prettier
- `npm run curl`: CLI tool for API requests (curl replacement)

## Technology Stack

- Node.js and Express
- TypeScript with ES Modules
- Pug template engine
- HTMX for dynamic UI
- Firebase for backend services
- Jest for unit testing
- Playwright for e2e testing
- ESLint and Prettier for code quality
