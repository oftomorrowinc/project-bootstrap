module.exports = {
  // Run type check on all relevant files
  '**/*.{ts,tsx}': () => 'npm run typecheck',

  // Lint and format all files
  '**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write'
  ],

  // Format other files
  '**/*.{css,json,md}': [
    'prettier --write'
  ],
};