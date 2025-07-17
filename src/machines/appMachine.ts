import { setup, assign, createActor } from 'xstate';

interface Question {
  id: string;
  text: string;
  choices: string[];
  correctAnswer: string;
}

interface AppContext {
  currentQuestion: Question | null;
  selectedChoice: string | null;
  score: number;
  currentQuestionIndex: number;
  isAnswerCorrect: boolean | null;
  quizCompleted: boolean;
  // TODO: Add more context properties like user profile, quiz settings, etc.
}

type AppEvents =
  | { type: 'START_QUIZ' }
  | { type: 'SELECT_CHOICE'; choice: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET_QUIZ' }
  | { type: 'LEAVE_QUIZ' };

export const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    choices: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
  },
  // TODO: Add more questions or fetch from API
  {
    id: '2',
    text: 'What is 2 + 2?',
    choices: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
  {
    id: '3',
    text: 'What is the largest planet in our solar system?',
    choices: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Jupiter',
  },
];

export const appMachine = setup({
  types: {
    context: {} as AppContext,
    events: {} as AppEvents,
  },
  actions: {
    startQuiz: assign({
      currentQuestion: sampleQuestions[0],
      score: 0,
      selectedChoice: null,
      currentQuestionIndex: 0,
      isAnswerCorrect: null,
      quizCompleted: false,
    }),
    selectChoice: assign({
      selectedChoice: ({ event }) => {
        if (event.type !== 'SELECT_CHOICE') return null;
        return event.choice;
      },
    }),
    submitAnswer: assign({
      score: ({ context }) => {
        if (!context.currentQuestion || !context.selectedChoice) {
          return context.score;
        }
        return context.selectedChoice === context.currentQuestion.correctAnswer
          ? context.score + 1
          : context.score;
      },
      isAnswerCorrect: ({ context }) => {
        if (!context.currentQuestion || !context.selectedChoice) {
          return null;
        }
        return context.selectedChoice === context.currentQuestion.correctAnswer;
      },
      quizCompleted: ({ context }) => {
        const nextIndex = context.currentQuestionIndex + 1;
        return nextIndex >= sampleQuestions.length;
      },
    }),
    loadNextQuestion: assign({
      currentQuestionIndex: ({ context }) => context.currentQuestionIndex + 1,
      currentQuestion: ({ context }) => {
        const nextIndex = context.currentQuestionIndex + 1;
        return nextIndex < sampleQuestions.length
          ? sampleQuestions[nextIndex]
          : null;
      },
      selectedChoice: null,
      isAnswerCorrect: null,
    }),
    resetQuiz: assign({
      currentQuestion: null,
      selectedChoice: null,
      score: 0,
      currentQuestionIndex: 0,
      isAnswerCorrect: null,
      quizCompleted: false,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEcCuBLAXgQQA64Dp0IAbMAYgGUAVbAJWoH0BFAVQEkAtAbQAYBdRKFwB7WOgAu6EQDshIAB6IAjAA4AnAV4A2AMwB2dfoBMqgKxHdqgDQgAniv3aCFp2dW7j2s9tUAWMwBfQNs0LDxCYjJyOgBRSlimNi4+QSQQUXEpWXklBD9jWwcEdWUCZV1dUr9dP2U-Jz8-YNCMHHwCNDhsmQBZEQgAQxIqWIAZWIBhJkmACQB5dknY1PlMyWk5dLyDZybtbV59fXN1VXOilV4y-WUzM15VPSaKupaQMPbCLtge-qGRpRWAAhXrsJjYABylAA6rE6Kt0userkVBotHpDCZTvorJcEKoyp5jOpjH5tOozqprsZgiEQDIBnB5J8ImsxBscttEABabT4vnvVkdKJgdlZTaohC4gj6Xhk3HaNR+a4efHKUoEFVPBrqXzKbQNbRCtoRTqobqbf7DcWcragHb+WXGCpWPS6XyqQr2RDGa4ESnygpeZTKa76Zp0oA */
  id: 'quizApp',
  initial: 'idle',
  context: {
    currentQuestion: null,
    selectedChoice: null,
    score: 0,
    currentQuestionIndex: 0,
    isAnswerCorrect: null,
    quizCompleted: false,
  },
  states: {
    idle: {
      on: {
        START_QUIZ: {
          target: 'questionModal',
          actions: 'startQuiz',
        },
        RESET_QUIZ: {
          actions: 'resetQuiz',
        },
      },
    },
    questionModal: {
      on: {
        SELECT_CHOICE: {
          actions: 'selectChoice',
        },
        SUBMIT_ANSWER: {
          target: 'answerFeedback',
          actions: 'submitAnswer',
        },
      },
    },
    answerFeedback: {
      on: {
        NEXT_QUESTION: [
          {
            target: 'quizComplete',
            guard: ({ context }) => context.quizCompleted,
          },
          {
            target: 'questionModal',
            actions: 'loadNextQuestion',
          },
        ],
      },
    },
    quizComplete: {
      on: {
        RESET_QUIZ: {
          target: 'idle',
          actions: 'resetQuiz',
        },
        LEAVE_QUIZ: {
          target: 'idle',
          actions: 'resetQuiz',
        },
      },
    },
  },
});

// Create global actor following Stately guide
export const globalQuizActor = createActor(appMachine);
globalQuizActor.start();
