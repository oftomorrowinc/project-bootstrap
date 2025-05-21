# CLAUDE.md

## Project: nextjs-app

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
  Ask developer for output when needed
  Ask developer to restart server or emulator as needed
  ```

3. When adding new features:
   - Add appropriate tests
   - Update documentation
   - Follow the established code style

## Project Structure

- `src/`: Source code
  - `app/`: Next.js app directory (pages, layouts, routes)
  - `components/`: React components
  - `lib/`: Third-party libraries and integrations
  - `styles/`: Theme and custom styling
  - `utils/`: Utility functions
- `public/`: Static assets
- `tests/`: Test files
  - `unit/`: Jest unit tests
  - `e2e/`: Playwright end-to-end tests
- `scripts/`: Utility scripts

## Common Commands

- `npm run dev`: Start the development server
- `npm run build`: Build the app for production
- `npm run start`: Start the production server
- `npm run typecheck`: Check TypeScript types
- `npm run test`: Run Jest tests
- `npm run test:e2e`: Run Playwright end-to-end tests
- `npm run lint`: Check code style
- `npm run format`: Format code with Prettier
- `npm run deploy`: Deploy to Firebase App Hosting

## Technology Stack

- Next.js with App Router
- React with TypeScript
- Firebase App Hosting and Firestore
- TailwindCSS with dark theme support
- Jest for unit testing
- Playwright for e2e testing
- ESLint and Prettier for code quality

## Firebase Integration

The app is configured to use Firebase services including:
- Authentication
- Firestore
- Storage
- App Hosting

When deployed, SSR is disabled by default since this is primarily a client-side app. To use Server Components, configuration in `next.config.js` will need to be modified.