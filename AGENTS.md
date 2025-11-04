# Agent Guidelines for my-app

## Commands

- **Build**: `npm run build`
- **Dev server**: `npm run dev`
- **Lint**: `npm run lint` (auto-fixes)
- **Format**: `npm run format`
- **Test**: No test framework configured yet

## Code Style

- **Imports**: React first, then relative imports. Prefer named exports.
- **Formatting**: Prettier (no semicolons, single quotes, 100 char width, ES5 trailing commas)
- **Types**: Strict TypeScript. Use `JSX.Element` for component returns. Define interfaces for props/data.
- **Naming**: PascalCase components, camelCase functions/hooks/variables, UPPER_CASE constants
- **Error handling**: Try-catch with user-friendly messages. Handle loading/error states in UI.
- **React**: Functional components with hooks. Use useMemo for expensive computations. Proper cleanup.

## Architecture

- **Components**: src/components/ (functional, typed props)
- **Hooks**: src/hooks/ (custom hooks with TypeScript)
- **Styling**: Inline styles or CSS modules (no CSS-in-JS framework yet)
- **Data fetching**: Custom hooks with caching, retry, timeout logic</content>
  <parameter name="filePath">/Users/dyukovlad/dev/my-app/AGENTS.md
