import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { appMachine, sampleQuestions } from './appMachine';

describe('App Machine', () => {
  describe('Initial State', () => {
    it('should start in idle state', () => {
      const actor = createActor(appMachine);
      actor.start();

      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('should have initial context values', () => {
      const actor = createActor(appMachine);
      actor.start();

      const context = actor.getSnapshot().context;
      expect(context.currentQuestion).toBeNull();
      expect(context.selectedChoice).toBeNull();
      expect(context.score).toBe(0);
    });
  });

  describe('Starting Quiz', () => {
    it('should transition to questionModal state when START_QUIZ is sent', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });

      expect(actor.getSnapshot().value).toBe('questionModal');
    });

    it('should set currentQuestion and reset score when starting quiz', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });

      const context = actor.getSnapshot().context;
      expect(context.currentQuestion).not.toBeNull();
      expect(context.currentQuestion?.text).toBe(
        'What is the capital of France?'
      );
      expect(context.score).toBe(0);
      expect(context.selectedChoice).toBeNull();
    });
  });

  describe('Question Selection', () => {
    it('should update selectedChoice when SELECT_CHOICE is sent', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });

      const context = actor.getSnapshot().context;
      expect(context.selectedChoice).toBe('Paris');
    });

    it('should remain in questionModal state when selecting choice', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'London' });

      expect(actor.getSnapshot().value).toBe('questionModal');
    });

    it('should update selectedChoice when different choice is selected', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'London' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });

      const context = actor.getSnapshot().context;
      expect(context.selectedChoice).toBe('Paris');
    });
  });

  describe('Submitting Answer', () => {
    it('should transition to answerFeedback state when SUBMIT_ANSWER is sent', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      expect(actor.getSnapshot().value).toBe('answerFeedback');
    });

    it('should increment score when correct answer is submitted', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.score).toBe(1);
    });

    it('should not increment score when incorrect answer is submitted', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'London' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.score).toBe(0);
    });

    it('should set isAnswerCorrect flag after submitting', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.isAnswerCorrect).toBe(true);
    });

    it('should handle submitting without selecting choice', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.score).toBe(0);
      expect(context.selectedChoice).toBeNull();
      expect(context.isAnswerCorrect).toBeNull();
      expect(actor.getSnapshot().value).toBe('answerFeedback');
    });
  });

  describe('Quiz Exit and Reset', () => {
    it('should reset all context values when RESET_QUIZ is sent from quizComplete state', () => {
      const actor = createActor(appMachine);
      actor.start();

      // Complete the entire quiz
      actor.send({ type: 'START_QUIZ' });

      // Question 1
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 2
      actor.send({ type: 'SELECT_CHOICE', choice: '4' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 3
      actor.send({ type: 'SELECT_CHOICE', choice: 'Jupiter' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Should be in quizComplete state
      expect(actor.getSnapshot().value).toBe('quizComplete');

      // Reset quiz
      actor.send({ type: 'RESET_QUIZ' });

      const context = actor.getSnapshot().context;
      expect(context.score).toBe(0);
      expect(context.selectedChoice).toBeNull();
      expect(context.currentQuestion).toBeNull();
      expect(context.currentQuestionIndex).toBe(0);
      expect(context.isAnswerCorrect).toBeNull();
      expect(context.quizCompleted).toBe(false);
      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('should reset all context values when LEAVE_QUIZ is sent from quizComplete state', () => {
      const actor = createActor(appMachine);
      actor.start();

      // Complete the entire quiz
      actor.send({ type: 'START_QUIZ' });

      // Question 1
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 2
      actor.send({ type: 'SELECT_CHOICE', choice: '4' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 3
      actor.send({ type: 'SELECT_CHOICE', choice: 'Jupiter' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Should be in quizComplete state
      expect(actor.getSnapshot().value).toBe('quizComplete');

      // Leave quiz
      actor.send({ type: 'LEAVE_QUIZ' });

      const context = actor.getSnapshot().context;
      expect(context.score).toBe(0);
      expect(context.selectedChoice).toBeNull();
      expect(context.currentQuestion).toBeNull();
      expect(context.currentQuestionIndex).toBe(0);
      expect(context.isAnswerCorrect).toBeNull();
      expect(context.quizCompleted).toBe(false);
      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('should only accept LEAVE_QUIZ and RESET_QUIZ events in quizComplete state', () => {
      const actor = createActor(appMachine);
      actor.start();

      // Complete the quiz to get to quizComplete state
      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });
      actor.send({ type: 'SELECT_CHOICE', choice: '4' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Jupiter' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      expect(actor.getSnapshot().value).toBe('quizComplete');

      // Test that other events are ignored
      const beforeState = actor.getSnapshot();
      actor.send({ type: 'START_QUIZ' });
      const afterInvalidEvent = actor.getSnapshot();

      expect(beforeState.value).toBe(afterInvalidEvent.value);
      expect(beforeState.context).toEqual(afterInvalidEvent.context);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle question progression correctly', () => {
      const actor = createActor(appMachine);
      actor.start();

      // First question - correct answer
      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      expect(actor.getSnapshot().context.score).toBe(1);
      expect(actor.getSnapshot().value).toBe('answerFeedback');

      // Go to next question
      actor.send({ type: 'NEXT_QUESTION' });

      expect(actor.getSnapshot().context.currentQuestionIndex).toBe(1);
      expect(actor.getSnapshot().value).toBe('questionModal');
    });

    it('should handle changing selection before submitting', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'London' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Berlin' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      expect(actor.getSnapshot().context.score).toBe(1);
    });

    it('should complete quiz after answering all questions', () => {
      const actor = createActor(appMachine);
      actor.start();

      // Answer all 3 questions
      actor.send({ type: 'START_QUIZ' });

      // Question 1
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });
      // Question 2
      actor.send({ type: 'SELECT_CHOICE', choice: '4' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 3
      actor.send({ type: 'SELECT_CHOICE', choice: 'Jupiter' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      expect(actor.getSnapshot().value).toBe('quizComplete');
      expect(actor.getSnapshot().context.score).toBe(3);
    });
  });

  describe('Answer Feedback', () => {
    it('should show correct feedback for right answer', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.isAnswerCorrect).toBe(true);
      expect(actor.getSnapshot().value).toBe('answerFeedback');
    });

    it('should show incorrect feedback for wrong answer', () => {
      const actor = createActor(appMachine);
      actor.start();

      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'London' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.isAnswerCorrect).toBe(false);
      expect(actor.getSnapshot().value).toBe('answerFeedback');
    });

    it('should indicate non-final question for first questions', () => {
      const actor = createActor(appMachine);
      actor.start();

      // First question (not final)
      actor.send({ type: 'START_QUIZ' });
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.currentQuestionIndex).toBe(0);
      expect(context.currentQuestionIndex + 1 < sampleQuestions.length).toBe(
        true
      );
      expect(actor.getSnapshot().value).toBe('answerFeedback');
    });

    it('should indicate final question when on last question', () => {
      const actor = createActor(appMachine);
      actor.start();

      // Answer first two questions to get to final question
      actor.send({ type: 'START_QUIZ' });

      // Question 1
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 2
      actor.send({ type: 'SELECT_CHOICE', choice: '4' });
      actor.send({ type: 'SUBMIT_ANSWER' });
      actor.send({ type: 'NEXT_QUESTION' });

      // Question 3 (final question)
      actor.send({ type: 'SELECT_CHOICE', choice: 'Jupiter' });
      actor.send({ type: 'SUBMIT_ANSWER' });

      const context = actor.getSnapshot().context;
      expect(context.currentQuestionIndex).toBe(2); // Final question index
      expect(context.currentQuestionIndex + 1 >= sampleQuestions.length).toBe(
        true
      );
      expect(actor.getSnapshot().value).toBe('answerFeedback');
      expect(context.quizCompleted).toBe(true);
    });
  });

  describe('State Machine Structure', () => {
    it('should have correct machine id', () => {
      expect(appMachine.id).toBe('quizApp');
    });

    it('should not accept invalid events in wrong states', () => {
      const actor = createActor(appMachine);
      actor.start();

      // Try to select choice while in idle state (should be ignored)
      const initialState = actor.getSnapshot();
      actor.send({ type: 'SELECT_CHOICE', choice: 'Paris' });
      const afterInvalidEvent = actor.getSnapshot();

      expect(initialState.value).toBe(afterInvalidEvent.value);
      expect(initialState.context).toEqual(afterInvalidEvent.context);
    });
  });
});
