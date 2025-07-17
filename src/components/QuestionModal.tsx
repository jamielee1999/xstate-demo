import { useSelector } from '@xstate/react';
import { globalQuizActor } from '../machines/appMachine';

export function QuestionModal() {
  // Use global actor with useSelector following Stately guide
  const state = useSelector(globalQuizActor, (snapshot) => snapshot.value);
  const currentQuestion = useSelector(
    globalQuizActor,
    (snapshot) => snapshot.context.currentQuestion
  );
  const selectedChoice = useSelector(
    globalQuizActor,
    (snapshot) => snapshot.context.selectedChoice
  );
  const isAnswerCorrect = useSelector(
    globalQuizActor,
    (snapshot) => snapshot.context.isAnswerCorrect
  );
  const currentQuestionIndex = useSelector(
    globalQuizActor,
    (snapshot) => snapshot.context.currentQuestionIndex
  );
  const quizCompleted = useSelector(
    globalQuizActor,
    (snapshot) => snapshot.context.quizCompleted
  );

  if (
    !currentQuestion ||
    (state !== 'questionModal' && state !== 'answerFeedback')
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">
              Question {currentQuestionIndex + 1}
            </h2>
            <span className="text-sm text-gray-500">of 3</span>
          </div>
          <p className="text-lg">{currentQuestion.text}</p>
        </div>

        {state === 'questionModal' && (
          <>
            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() =>
                    globalQuizActor.send({ type: 'SELECT_CHOICE', choice })
                  }
                  className={`w-full p-3 text-left rounded border transition-colors ${
                    selectedChoice === choice
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => globalQuizActor.send({ type: 'SUBMIT_ANSWER' })}
                disabled={!selectedChoice}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          </>
        )}

        {state === 'answerFeedback' && (
          <>
            <div className="mb-6">
              <div
                className={`p-4 rounded-lg mb-4 ${
                  isAnswerCorrect
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isAnswerCorrect ? (
                    <span className="text-green-600 text-xl">✓</span>
                  ) : (
                    <span className="text-red-600 text-xl">✗</span>
                  )}
                  <span
                    className={`font-semibold ${
                      isAnswerCorrect ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {isAnswerCorrect ? 'Correct!' : 'Incorrect!'}
                  </span>
                </div>
                {!isAnswerCorrect && (
                  <p className="text-red-700">
                    The correct answer was:{' '}
                    <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => globalQuizActor.send({ type: 'NEXT_QUESTION' })}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {quizCompleted ? 'View Results' : 'Next Question'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
