# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript demonstration project showcasing XState v5 for state management in a quiz application. The app features a modal-based question interface with Tailwind CSS v4 styling, React Query for data fetching infrastructure, and Axios for HTTP requests.

## Development Commands

```bash
# Start development server (runs on port 8394, fallback to 8395)
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run tests with UI
pnpm test:ui
```

## Architecture & Key Concepts

### State Management Architecture
The application uses XState v5 for state management with a centralized state machine approach:

- **Machine Definition**: `src/machines/appMachine.ts` contains the main state machine
- **States**: Implements `idle`, `questionModal`, `answerFeedback`, and `quizComplete` states
- **Context**: Manages `currentQuestion`, `selectedChoice`, `score`, `currentQuestionIndex`, `isAnswerCorrect`, and `quizCompleted`
- **Events**: Handles `START_QUIZ`, `SELECT_CHOICE`, `SUBMIT_ANSWER`, `NEXT_QUESTION`, `RESET_QUIZ`, `LEAVE_QUIZ` events

### Component Architecture
- **App Component**: Main container that consumes the XState machine and renders UI based on current state
- **QuestionModal**: Modal component that displays questions, answer feedback, and handles user interactions
- **QuizResults**: Results component that shows final score and completion message
- **QueryProvider**: React Query provider wrapper for future API integration

### Data Flow Pattern
1. User interactions trigger XState events via global actor
2. State machine transitions update context and determine next state
3. Components reactively render based on current state and context using `useSelector`
4. Quiz flow: `idle` → `questionModal` → `answerFeedback` → (`questionModal` | `quizComplete`)
5. Answer feedback shows success/error with option to continue
6. Quiz completion shows final results with restart option

### Styling Architecture
- Uses Tailwind CSS v4 with Vite plugin integration
- Utility-first approach with responsive design considerations
- Modal overlay pattern with fixed positioning and backdrop

## Current Implementation Status

### Completed Features
- XState machine using `setup()` function with strong typing
- Complete quiz flow with 4 states: idle, questionModal, answerFeedback, quizComplete
- Question modal with choice selection and answer feedback
- Success/error feedback display with correct answer reveal
- Next question progression and quiz completion
- Score tracking and final results display
- Quiz exit options: "Leave Quiz" and "Take Quiz Again" buttons
- Global state management with shared actor
- Tailwind CSS v4 integration with Vite
- React Query provider setup
- TypeScript interfaces for Questions and Events
- Comprehensive unit tests with Vitest (24 tests)

### TODO Features (as documented in code)
- Additional states: `loading`, `error`
- API integration with axios for question fetching
- React Query hooks for data management
- Local storage for quiz progress
- Navigation between questions (previous/skip)
- Loading spinner component
- Animations and responsive design improvements
- Question timer functionality
- Multiple quiz categories

## Key Files and Responsibilities

- `src/machines/appMachine.ts`: Core state machine logic and question data
- `src/machines/appMachine.test.ts`: Comprehensive unit tests for state machine (24 tests)
- `src/components/QuestionModal.tsx`: Question display, answer feedback, and user interaction handling
- `src/components/QuizResults.tsx`: Final results display and quiz restart functionality
- `src/providers/QueryProvider.tsx`: React Query configuration and setup
- `src/App.tsx`: Main application component and state integration
- `vite.config.ts`: Build configuration with Tailwind CSS v4 setup

## Technology Stack Specifics

- **XState v5**: Latest version with `setup()` function for strong typing
- **Tailwind CSS v4**: Uses new Vite plugin instead of PostCSS configuration
- **React Query v5**: TanStack Query for future server state management
- **TypeScript 5.8**: Strict typing with interface definitions
- **Vite 7**: Build tool with React plugin and custom port configuration
- **Vitest 3**: Fast unit testing framework with UI support

## Development Notes

### XState Patterns
- Use `setup()` function with typed context and events for strong typing
- Define named actions in the setup configuration for reusability
- **Global State**: Create global actor with `createActor()` and `start()` for shared state
- Use `useSelector()` hook to access specific parts of global state efficiently
- Send events directly to global actor: `globalActor.send({ type: 'EVENT' })`
- Use discriminated union types for events instead of interfaces

### Testing Patterns
- Test state machine logic independently using `createActor`
- Test initial state, transitions, context updates, and edge cases
- Use Vitest for fast, modern testing with TypeScript support
- Test machine behavior without UI coupling

### Component Patterns
- Components use `useSelector()` to subscribe to specific state/context values
- Modal components check state machine state for conditional rendering
- Event handlers send events directly to global actor
- Avoid prop drilling by accessing global state directly in components

### Future API Integration
- React Query client is pre-configured with 5-minute stale time
- Axios is installed and ready for HTTP requests
- Question fetching logic should integrate with state machine transitions