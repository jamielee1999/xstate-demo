# XState Demo Project

A React TypeScript project demonstrating XState v5 with a quiz modal interface, Tailwind CSS v4, React Query, and Axios.

## Features

- ✅ XState v5 state machine for quiz flow
- ✅ Question modal with multiple choice answers
- ✅ Tailwind CSS v4 for styling
- ✅ React Query for data fetching (setup ready)
- ✅ Axios for HTTP requests (installed)
- ✅ TypeScript for type safety

## TODO Features to Complete

### State Machine Enhancements
- [ ] Add more states: `loading`, `results`, `error`
- [ ] Implement `NEXT_QUESTION` transition
- [ ] Add question fetching logic
- [ ] Implement quiz completion flow

### Components
- [ ] Add React Query DevTools
- [ ] Create loading spinner component
- [ ] Add results/score display component
- [ ] Implement question navigation (previous/next)

### Data & API
- [ ] Create API service with axios for fetching questions
- [ ] Add React Query hooks for question management
- [ ] Implement local storage for quiz progress
- [ ] Add more sample questions

### UI/UX
- [ ] Add animations and transitions
- [ ] Implement responsive design
- [ ] Add dark mode support
- [ ] Create better visual feedback for answers

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── components/
│   └── QuestionModal.tsx    # Quiz modal component
├── machines/
│   └── appMachine.ts        # XState machine definition
├── providers/
│   └── QueryProvider.tsx   # React Query setup
├── App.tsx                  # Main app component
└── main.tsx                # App entry point
```

## Technologies Used

- React 19.1.0
- TypeScript 5.8.3
- XState 5.20.1
- @xstate/react 6.0.0
- @tanstack/react-query 5.83.0
- Tailwind CSS 4.1.11
- Axios 1.10.0
- Vite 7.0.4# xstate-demo
