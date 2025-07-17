import { useSelector } from '@xstate/react';
import { globalQuizActor } from '../machines/appMachine';

export function QuizResults() {
  const state = useSelector(globalQuizActor, (snapshot) => snapshot.value);
  const score = useSelector(
    globalQuizActor,
    (snapshot) => snapshot.context.score
  );

  if (state !== 'quizComplete') {
    return null;
  }

  const totalQuestions = 3;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (percentage >= 80) return 'Excellent work! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    if (percentage >= 40) return 'Not bad, keep practicing! 💪';
    return 'Keep studying and try again! 📚';
  };

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6">Quiz Complete!</h2>

        <div className="mb-6">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
            {score}/{totalQuestions}
          </div>
          <div className={`text-2xl font-semibold mb-4 ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-lg text-gray-700 mb-4">{getScoreMessage()}</p>
        </div>

        <div className="flex gap-x-2">
          <button
            onClick={() => globalQuizActor.send({ type: 'LEAVE_QUIZ' })}
            className="w-full font-semibold py-3 px-6 rounded-lg transition-colors bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Leave Quiz
          </button>

          <button
            onClick={() => globalQuizActor.send({ type: 'RESET_QUIZ' })}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  );
}
